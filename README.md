# 🎮 SNES Retro Vault - Portal Privado de Super Nintendo

Portal web moderno em dark mode com arquitetura de alta performance para execução de jogos de Super Nintendo no navegador usando **EmulatorJS**, suporte nativo a controles USB/Xbox de PC e troca dinâmica de jogos sem vazamento de memória.

Otimizado para hospedar gratuitamente na **Vercel** ou em qualquer servidor estático.

---

## 📁 Estrutura do Projeto

```text
├── assets/
│   └── covers/               # Capas dos jogos em alta definição estilo 16-bit
│       ├── super-metroid.jpg
│       ├── super-mario-world.jpg
│       ├── megaman-x2.jpg
│       ├── megaman-x3.jpg
│       └── cybernator.jpg
├── roms/                     # Diretório organizado para seus arquivos .sfc ou .smc
│   ├── .gitkeep
│   ├── README.md
│   ├── super-metroid.sfc     # (Jogo Principal em Destaque)
│   ├── super-mario-world.sfc
│   ├── megaman-x2.sfc
│   ├── megaman-x3.sfc
│   └── cybernator.sfc
├── index.html                # Interface principal (Dark mode, menu lateral e container #emulator)
├── player.html               # Container isolado do EmulatorJS para troca dinâmica e limpeza de Wasm
├── style.css                 # Folha de estilos moderna com Glassmorphism e responsividade
├── app.js                    # Motor JavaScript (Catálogo, detecção de Gamepad e troca de instâncias)
├── vercel.json               # Configurações de cabeçalhos de segurança, CORS e cache para a Vercel
└── README.md                 # Guia do projeto
```

---

## 🕹️ Lista de Jogos Configurados

1. **Super Metroid** (`super-metroid.sfc`) — *Destacado como o principal do portal com borda dourada e badge.*
2. **Super Mario World** (`super-mario-world.sfc`)
3. **Mega Man X2** (`megaman-x2.sfc`)
4. **Mega Man X3** (`megaman-x3.sfc`)
5. **Cybernator** (`roms/snes/Cybernator (USA).zip`)

> Você também pode carregar qualquer arquivo `.sfc` / `.smc` do seu computador através do botão **"Carregar ROM do PC"** no rodapé do menu.

---

## 🎮 Suporte a Controles (USB / Xbox / PC)

O portal está configurado com a API nativa de Gamepad do HTML5 e permissões completas no EmulatorJS:

- **Detecção Automática:** Basta plugar seu controle USB ou Bluetooth (Xbox 360/One/Series, PS4/PS5 ou Genérico). O indicador na barra lateral mostrará **"Conectado: Xbox Controller"** em verde assim que você pressionar qualquer botão.
- **Mapeamento Nativo no Emulador:**
  1. Mova o mouse sobre a barra inferior do emulador durante o jogo.
  2. Clique no ícone de **Engrenagem (⚙️ Configurações)**.
  3. Acesse **Controls > Gamepad**.
  4. Clique no botão que deseja remapear e pressione o botão físico no controle. As configurações ficam salvas no navegador.
- **Teclado (Padrão):**
  - **D-Pad:** Setas direcionais
  - **Botões A / B / X / Y:** Teclas `X`, `Z`, `S`, `A`
  - **L / R (Gatilhos):** Teclas `Q` e `W`
  - **Select / Start:** Teclas `Shift` e `Enter`

---

## ⚡ Como Rodar e Testar Localmente

Por segurança dos navegadores modernos (CORS e WebAssembly), abra o projeto usando um servidor HTTP local:

### Opção 1: Via VS Code (Live Server)
Clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

### Opção 2: Via Python (Terminal)
```bash
python -m http.server 3000
```
Acesse no navegador: `http://localhost:3000`

### Opção 3: Via Node.js (npx serve)
```bash
npx serve .
```

---

## 🚀 Como Publicar Grátis na Vercel

1. Coloque seus arquivos `.sfc` na pasta `/roms/`.
2. Envie o projeto para um repositório no seu GitHub (público ou privado).
3. Acesse [vercel.com](https://vercel.com) e clique em **"Add New Project"**.
4. Importe o repositório.
5. Clique em **Deploy** (não precisa alterar nada nas configurações de build, o arquivo `vercel.json` cuidará de tudo automaticamente).
6. Pronto! Seu portal de SNES estará online com certificado SSL gratuito.


## Inicialização rápida no Windows

Dê dois cliques em `iniciar.bat` e abra http://localhost:3000 no Chrome ou Edge.
Clique em **Iniciar jogo** na tela do emulador; depois use Enter para Start.
Clique dentro do jogo se o teclado estiver na busca ou em outro elemento.
O emulador é baixado do CDN e exige internet. Abrir index.html com file:// não funciona.

Para Xbox USB, conecte, pressione um botão e use o direcional. O mapa usa a posição
física dos botões: Xbox A → SNES B, B → A, X → Y, Y → X; LB/RB → L/R.
Controles genéricos podem exigir remapeamento em Configurações do Controle.
Se você já salvou outro mapa no navegador, use Resetar nessa janela para restaurar os padrões.
As ROMs ZIP podem ser selecionadas pelo botão Carregar ROM do PC.

Veja `AUDITORIA.md` para os problemas encontrados e os limites da validação.


## Biblioteca completa

O menu inclui todas as 332 ROMs atualmente presentes em `roms/snes`, incluindo
variantes regionais e traduções. As informações vêm de `gamelist.xml` quando disponíveis.
São usadas 100 capas locais e uma capa padrão para as 232 entradas restantes.
Os vídeos da pasta não são usados pelo player.

Após adicionar ou remover ROMs, execute `python scripts/update_catalog.py` na pasta
do projeto para regenerar `catalog.js`, depois recarregue a página.
A biblioteca é estática e funciona também na hospedagem; nenhum arquivo de jogo foi alterado.
