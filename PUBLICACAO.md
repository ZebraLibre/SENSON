# Publicação — pesquisa de 08/10/2026

Tamanhos em MB decimais: 100 vídeos = 544,88 MB; 332 ZIPs = 367,78 MB;
4 ROMs extraídas duplicadas = 7,34 MB; imagens = 35,45 MB.
O build seleciona somente o site e as ROMs/capas referenciadas no catálogo:
439 arquivos, 397,50 MB, nenhum vídeo. Os arquivos originais continuam no PC.

## Caminho sugerido

Criar repositório privado na conta pessoal GitHub e importar na Vercel Hobby.
Framework: Other; build: npm run build; saída: dist (já em vercel.json).
Não usar upload direto pela CLI: o limite Hobby de 100 MB é para esse método.
https://vercel.com/docs/limits

O GitHub bloqueia arquivos individuais acima de 100 MiB e recomenda repositórios
abaixo de 1 GB. A coleção sem vídeos está abaixo dessa recomendação.
https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github

Hobby destina-se a uso pessoal e não comercial. As cotas de uso e armazenamento
devem ser acompanhadas no painel; excluir vídeos não garante uso gratuito ilimitado.
https://vercel.com/pricing

Não é necessário Supabase para o site estático. Como alternativa futura, Free
oferece 1 GB de arquivos, 5 GB de saída e 5 GB de saída em cache; projetos podem
pausar após uma semana sem atividade. Acrescentaria integração e gestão de acesso.
https://supabase.com/pricing

Repositório privado não torna o site ou os arquivos publicados privados.
Definir acesso por link ou autenticação antes da publicação. O site poderá rodar
em outro PC compatível via HTTPS; saves atuais ficam no navegador e não são
sincronizados entre computadores automaticamente.

Pendência: identificar a nova conta, o repositório e o modelo de acesso, depois
enviar ao GitHub, importar na Vercel e testar a URL publicada.
