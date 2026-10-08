# Auditoria e correções — 08/10/2026

## Causas comprovadas no código

1. `EJS_defaultControls` tinha um objeto `joypad` com códigos numéricos de teclado. O EmulatorJS espera índices de ações SNES (0=B, 8=A etc.) e objetos `value`/`value2`. O formato anterior não configurava o teclado anunciado nem os botões Xbox. Corrigido em `player.js`, conforme https://emulatorjs.org/docs4devs/control-mapping/.
2. Cybernator apontava para `roms/cybernator.sfc`, inexistente. Corrigido para o ZIP existente `roms/snes/Cybernator (USA).zip`; o arquivo foi verificado e contém ROM SNES.
3. O indicador USB encerrava a consulta ao encontrar o primeiro controle e apagava o estado ao desconectar qualquer controle. Agora consulta continuamente e escolhe um controle ainda conectado.
4. O foco era aplicado apenas ao iframe após uma troca. Agora o player recebe foco quando a execução inicia e quando a ajuda é fechada.
5. As URLs de ROMs locais nunca eram liberadas e o seletor não validava extensão/arquivo vazio. Agora há validação, liberação ao trocar de jogo e possibilidade de selecionar o mesmo arquivo novamente.
6. O player não explicava ROM ausente, CDN inacessível ou uso de file://. Adicionadas verificações e mensagens. `iniciar.bat` inicia um servidor Python restrito ao próprio PC.

## Condições de funcionamento

Abrir http://localhost:3000 pelo servidor local (ou hospedar em HTTPS). Clicar em Iniciar jogo é necessário para a interação inicial e o áudio do navegador; `EJS_startOnLoaded=false` é intencional, não um defeito. O emulador depende da internet e do CDN oficial. Controles genéricos e configurações anteriormente salvas podem precisar de remapeamento/reset no menu do EmulatorJS. O indicador USB informa conexão; a leitura dos botões é feita pelo próprio EmulatorJS.

## Validação

- `node --check app.js` e `node --check player.js`: aprovados.
- Todas as cinco ROMs do catálogo existem e retornaram HTTP 200 no servidor local.
- ZIP de Cybernator: integridade e presença de ROM .sfc/.smc verificadas.
- Navegador: interface carregou, botão Iniciar jogo funcionou e Super Metroid executou, exibindo animação e tela de título.
- Enviadas teclas Enter ao player. A execução foi confirmada visualmente; todos os comandos de gameplay ainda precisam ser conferidos em uma partida.
- Nenhum controle USB foi conectado durante a auditoria; o mapa Xbox foi configurado conforme a documentação, sem teste físico.

Não há evidência suficiente para afirmar que todas as ROMs são dumps corretos ou que todos os jogos terminam sem erros. A auditoria valida a integração e os problemas acima.
