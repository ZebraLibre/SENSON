/* Public EmulatorJS configuration; input is handled by the emulator itself. */
const params = new URLSearchParams(location.search);
const status = document.getElementById('player-status');
function showStatus(message) {
  status.textContent = message;
  status.hidden = false;
}
function focusGame() {
  window.focus();
  document.getElementById('game').focus();
}
window.EJS_player = '#game';
window.EJS_core = 'snes';
window.EJS_gameName = params.get('name') || 'Super Metroid';
window.EJS_gameUrl = params.get('rom') || 'roms/snes/Super Metroid (Japan, USA) (En,Ja).zip';
window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
window.EJS_startOnLoaded = false;
window.EJS_startButtonName = 'Iniciar jogo';
window.EJS_color = '#8b5cf6';
window.EJS_disableDatabases = true;
window.EJS_threads = false;
window.EJS_defaultControls = {
  0: {
    0: { value: 'z', value2: 'BUTTON_1' }, // SNES B / Xbox A
    1: { value: 'a', value2: 'BUTTON_3' }, // SNES Y / Xbox X
    2: { value: 'shift', value2: 'SELECT' },
    3: { value: 'enter', value2: 'START' },
    4: { value: 'up arrow', value2: 'DPAD_UP' },
    5: { value: 'down arrow', value2: 'DPAD_DOWN' },
    6: { value: 'left arrow', value2: 'DPAD_LEFT' },
    7: { value: 'right arrow', value2: 'DPAD_RIGHT' },
    8: { value: 'x', value2: 'BUTTON_2' }, // SNES A / Xbox B
    9: { value: 's', value2: 'BUTTON_4' }, // SNES X / Xbox Y
    10: { value: 'q', value2: 'LEFT_TOP_SHOULDER' },
    11: { value: 'w', value2: 'RIGHT_TOP_SHOULDER' }
  },
  1: {}, 2: {}, 3: {}
};
window.EJS_ready = () => { status.hidden = true; };
window.EJS_onGameStart = () => { status.hidden = true; focusGame(); };
document.getElementById('game').tabIndex = -1;

async function boot() {
  if (location.protocol === 'file:') {
    showStatus('Abra pelo servidor local: execute iniciar.bat e acesse http://localhost:3000.');
    return;
  }
  try {
    const rom = new URL(window.EJS_gameUrl, location.href);
    if (!(rom.protocol === 'blob:' || (rom.origin === location.origin && /\.(sfc|smc|bin|zip)$/i.test(rom.pathname)))) {
      throw new Error('Selecione uma ROM local de SNES (.sfc, .smc, .bin ou .zip).');
    }
    const response = await fetch(rom, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`ROM não encontrada (HTTP ${response.status}).`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.length < 1024 || /text\/html/i.test(response.headers.get('content-type') || '')) {
      throw new Error('O arquivo recebido não é uma ROM válida.');
    }
    showStatus('Carregando o emulador… É necessária conexão com a internet.');
    const loader = document.createElement('script');
    loader.src = window.EJS_pathtodata + 'loader.js';
    loader.onerror = () => showStatus('Falha ao acessar o EmulatorJS. Verifique a internet e o acesso a cdn.emulatorjs.org e recarregue a página.');
    document.body.appendChild(loader);
  } catch (error) {
    showStatus(`Não foi possível carregar o jogo: ${error.message}`);
  }
}
boot();
