/**
 * SNES Retro Vault - Client Application Engine
 * Gerencia a lista de jogos, detecção nativa de Gamepad (USB/Xbox) e troca dinâmica do emulador.
 */

// Catálogo carregado por catalog.js.
// Estado da Aplicação
let currentGame = GAMES_CATALOG[0]; // Super Metroid como padrão
let activeConnectedGamepad = null;
let customRomBlob = null;

// Elementos do DOM
const dom = {
  gamesList: document.getElementById('games-list'),
  searchInput: document.getElementById('search-input'),
  emulatorFrame: document.getElementById('emulator-frame'),
  emulatorContainer: document.getElementById('emulator'),
  ambientGlow: document.getElementById('ambient-glow'),
  
  // Detalhes do Topbar
  activeGameThumb: document.getElementById('active-game-thumb'),
  activeGameTitle: document.getElementById('active-game-title'),
  activeGameTag: document.getElementById('active-game-tag'),
  activeGameGenre: document.getElementById('active-game-genre'),
  activeGameYear: document.getElementById('active-game-year'),
  activeGameFile: document.getElementById('active-game-file'),

  // Gamepad
  gamepadCard: document.getElementById('gamepad-status-card'),
  gamepadName: document.getElementById('gamepad-name'),
  gamepadDot: document.getElementById('gamepad-dot'),

  // Botões de Ação
  btnRestartGame: document.getElementById('btn-restart-game'),
  btnFullscreen: document.getElementById('btn-fullscreen'),
  btnControlsGuide: document.getElementById('btn-controls-guide'),
  btnOpenControlsHelp: document.getElementById('btn-open-controls-help'),
  btnToggleSidebar: document.getElementById('btn-toggle-sidebar'),
  sidebar: document.getElementById('sidebar'),

  // Modal
  controlsModal: document.getElementById('controls-modal'),
  modalBackdrop: document.getElementById('modal-backdrop'),
  btnCloseModal: document.getElementById('btn-close-modal'),
  btnCloseModalFooter: document.getElementById('btn-close-modal-footer'),

  // Custom ROM
  customRomInput: document.getElementById('custom-rom-input')
};

// ==========================================================================
// 1. Inicialização e Renderização da Lista de Jogos
// ==========================================================================

function initApp() {
  renderGamesList(GAMES_CATALOG);
  setupGamepadDetection();
  setupEventListeners();
  updateTopBar(currentGame);
  dom.emulatorFrame.src = `player.html?rom=${encodeURIComponent(currentGame.rom)}&name=${encodeURIComponent(currentGame.title)}`;
  document.getElementById("catalog-count").textContent = `${GAMES_CATALOG.length} jogos disponíveis`;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
}

function renderGamesList(games) {
  dom.gamesList.innerHTML = '';

  if (games.length === 0) {
    dom.gamesList.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        Nenhum jogo encontrado com esse termo.
      </div>
    `;
    return;
  }

  games.forEach(game => {
    const card = document.createElement('div');
    card.className = `game-card ${game.featured ? 'featured-game' : ''} ${game.id === currentGame.id ? 'active' : ''}`;
    card.id = `card-${game.id}`;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Selecionar jogo ${game.title}`);

    card.title = game.filename || game.title;
    card.innerHTML = `
      <div class="game-cover-wrap">
        <img src="${escapeHTML(game.cover)}" alt="Capa ${escapeHTML(game.title)}" class="game-cover-img" loading="lazy">
      </div>
      <div class="game-meta">
        <div class="game-title-wrap">
          <span class="game-name">${escapeHTML(game.title)}</span>
          ${game.featured ? `<span class="badge-featured">DESTAQUE</span>` : ''}
        </div>
        <div class="game-details">
          <span>${escapeHTML(game.genre)}</span>
          <span class="game-dot">•</span>
          <span>${escapeHTML(game.year)}</span>
        </div>
      </div>
      <div class="game-status-indicator"></div>
    `;

    card.addEventListener('click', () => {
      switchGame(game);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        switchGame(game);
      }
    });

    dom.gamesList.appendChild(card);
  });
}

// ==========================================================================
// 2. Dinâmica de Troca de Jogo (Sem Quebrar o Player / Teardown Limpo)
// ==========================================================================

function switchGame(game, customBlobUrl = null) {
  if (currentGame.id === game.id && !customBlobUrl) return;

  const previousBlob = customRomBlob;
  customRomBlob = customBlobUrl;
  currentGame = game;

  // Atualiza classe ativa nos cards
  document.querySelectorAll('.game-card').forEach(card => {
    card.classList.remove('active');
  });
  const activeCard = document.getElementById(`card-${game.id}`);
  if (activeCard) {
    activeCard.classList.add('active');
  }

  // Atualiza Topbar e Ambiente
  updateTopBar(game);

  // Recarrega o Iframe isolado de forma limpa
  // O uso do Iframe garante a destruição completa do contexto de áudio, Wasm e loops do jogo anterior
  const targetRomUrl = customBlobUrl || (game.rom.startsWith('roms/') ? game.rom : `roms/${game.rom}`);
  const targetPlayerUrl = `player.html?rom=${encodeURIComponent(targetRomUrl)}&name=${encodeURIComponent(game.title)}`;

  // Aplica transição suave
  dom.emulatorFrame.style.opacity = '0.3';
  dom.emulatorFrame.src = targetPlayerUrl;
  if (previousBlob) URL.revokeObjectURL(previousBlob);

  dom.emulatorFrame.onload = () => {
    dom.emulatorFrame.style.opacity = '1';
    // Foca no emulador para captura imediata do teclado / gamepad
    dom.emulatorFrame.focus();
  };

  // Se estiver em mobile, fecha o sidebar após selecionar
  if (window.innerWidth <= 900) {
    dom.sidebar.classList.remove('open');
  }
}

function updateTopBar(game) {
  dom.activeGameThumb.src = game.cover;
  dom.activeGameTitle.textContent = game.title;
  dom.activeGameGenre.textContent = game.genre;
  dom.activeGameYear.textContent = game.year;
  dom.activeGameFile.textContent = game.rom.split('/').pop();

  if (game.featured) {
    dom.activeGameTag.classList.remove('hidden');
    dom.activeGameTag.textContent = game.tag || '⭐ DESTAQUE';
  } else {
    dom.activeGameTag.classList.add('hidden');
  }

  // Altera o brilho ambiente atrás da tela para combinar com a paleta do jogo
  dom.ambientGlow.style.background = `radial-gradient(circle, ${game.accentColor} 0%, transparent 70%)`;
}

// ==========================================================================
// 3. Suporte Nativo a Gamepads (USB / Xbox / Bluetooth)
// ==========================================================================

function setupGamepadDetection() {
  const refresh = () => {
    try {
      const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()) : [];
      const gp = pads.find(pad => pad && pad.connected) || null;
      if (gp?.index !== activeConnectedGamepad?.index || gp?.id !== activeConnectedGamepad?.id) {
        activeConnectedGamepad = gp;
        updateGamepadUI(gp, Boolean(gp));
      }
    } catch (error) {
      dom.gamepadName.textContent = 'Controle indisponível: use localhost ou HTTPS';
    }
  };
  updateGamepadUI(null, false);
  window.addEventListener('gamepadconnected', refresh);
  window.addEventListener('gamepaddisconnected', refresh);
  setInterval(refresh, 1000);
  refresh();
}

function updateGamepadUI(gamepad, isConnected) {
  if (isConnected && gamepad) {
    dom.gamepadCard.classList.add('connected');
    
    // Simplifica o nome para exibição amigável
    let cleanName = gamepad.id;
    if (cleanName.includes('Xbox')) cleanName = 'Xbox Controller';
    else if (cleanName.includes('DualSense')) cleanName = 'PS5 DualSense';
    else if (cleanName.includes('DualShock') || cleanName.includes('Wireless Controller')) cleanName = 'PS4 DualShock';
    else if (cleanName.length > 25) cleanName = cleanName.substring(0, 22) + '...';

    dom.gamepadName.textContent = `Conectado: ${cleanName}`;
    dom.gamepadName.title = gamepad.id;
  } else {
    dom.gamepadCard.classList.remove('connected');
    dom.gamepadName.textContent = 'Aguardando controle USB...';
    dom.gamepadName.title = 'Conecte um controle e aperte qualquer botão para ativar';
  }
}

// ==========================================================================
// 4. Manipulação de Eventos e Ações da Interface
// ==========================================================================

function setupEventListeners() {
  // Busca em tempo real na lista
  dom.searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = GAMES_CATALOG.filter(game => 
      game.title.toLowerCase().includes(query) ||
      game.genre.toLowerCase().includes(query) ||
      game.rom.toLowerCase().includes(query)
    );
    renderGamesList(filtered);
  });

  // Reiniciar jogo atual
  dom.btnRestartGame.addEventListener('click', () => {
    const currentSrc = dom.emulatorFrame.src;
    dom.emulatorFrame.src = 'about:blank';
    setTimeout(() => {
      dom.emulatorFrame.src = currentSrc;
      dom.emulatorFrame.focus();
    }, 100);
  });

  // Tela Cheia no container do emulador
  dom.btnFullscreen.addEventListener('click', toggleFullscreen);

  // Modal de Ajuda de Mapeamento
  const openModal = () => {
    dom.controlsModal.showModal();
  };
  const closeModal = () => {
    dom.controlsModal.close();
    dom.emulatorFrame.contentWindow.focus();
  };

  dom.btnControlsGuide.addEventListener('click', openModal);
  dom.btnOpenControlsHelp.addEventListener('click', openModal);
  dom.btnCloseModal.addEventListener('click', closeModal);
  dom.btnCloseModalFooter.addEventListener('click', closeModal);
  dom.modalBackdrop.addEventListener('click', closeModal);

  // Toggle do Sidebar em telas menores
  dom.btnToggleSidebar.addEventListener('click', () => {
    dom.sidebar.classList.toggle('open');
  });

  // Carregador de ROM personalizada (.sfc / .smc)
  dom.customRomInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!/\.(sfc|smc|bin|zip)$/i.test(file.name) || file.size === 0) {
      alert('Selecione uma ROM .sfc, .smc, .bin ou .zip válida e não vazia.');
      e.target.value = '';
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    const customGame = {
      id: 'custom-' + Date.now(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      rom: file.name,
      cover: 'assets/covers/super-metroid.jpg',
      genre: 'ROM Local Personalizada',
      year: 'Custom',
      featured: false,
      tag: 'LOCAL',
      accentColor: 'rgba(139, 92, 246, 0.45)',
      description: 'Jogo carregado diretamente do armazenamento local do navegador.'
    };

    switchGame(customGame, blobUrl);
    e.target.value = "";
  });
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    if (dom.emulatorContainer.requestFullscreen) {
      dom.emulatorContainer.requestFullscreen();
    } else if (dom.emulatorContainer.webkitRequestFullscreen) {
      dom.emulatorContainer.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Inicializa a aplicação ao carregar o DOM
document.addEventListener('DOMContentLoaded', initApp);
