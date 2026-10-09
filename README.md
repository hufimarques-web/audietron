# Audi e-tron Sportback — apresentação de venda

Site em Next.js (App Router), React e JavaScript. Estilos próprios, sem construtor de páginas.

## Executar

Requer Node.js 20.9 ou superior.

```sh
npm install
npm run dev
```

Para verificar e executar a versão de produção:

```sh
npm run build
npm run start
```

Abrir http://127.0.0.1:3000.

## Dados

O ficheiro `lib/car.js` contém o contacto e a lista de equipamento. Informação fornecida pelo proprietário: Audi e-tron Sportback 50 quattro S line, preto, primeira matrícula 07/2022, 30 000 km, preço 33 000 €, Aveiro, telefone +351 967 708 397. O WhatsApp abre uma mensagem preparada, sem enviar automaticamente.

## Experiência e media

- Abertura: `public/media/studio.mp4` — “Car lighting transition in studio”, aprovado.
- Estrada e túnel: `public/media/road.mp4` — “Car driving on road tunnel”, aprovado.
- Os vídeos avançam e recuam conforme o scroll; botões saltam para capítulos.
- Interior: `public/media/interior.mp4` — vídeo de 8 s fornecido pelo proprietário (`Car_interior_camera_transition_20261008215952.mp4`). Integrado no scroll com sobreposição de 0,45 s entre capítulos. O texto entra depois da aproximação ao habitáculo. `experience.mp4` reúne os três vídeos (24 s) para reprodução contínua no botão “Ver filme”.
- A saída do interior e ultrapassagem ainda não foi finalizada/aprovada e não está integrada.
- As seis fotografias da galeria são fotografias reais fornecidas pelo proprietário.
- As imagens de estúdio e sequências cinematográficas são ilustrativas, com indicação no site.
- Adaptação móvel, menu acessível, galeria em diálogo com navegação por teclado e respeito por `prefers-reduced-motion`.

## Publicação na Vercel

Importar `hufimarques-web/audietron`, selecionar Next.js e manter a raiz `./`. A instalação usa `npm ci` e a compilação `npm run build`. Não são necessárias chaves ou serviços externos. As imagens e os vídeos estão em `public/media`. A ligação ao GitHub permite novas publicações a cada push na branch principal.

O domínio de produção da Vercel é usado automaticamente nos metadados. Para um domínio próprio, definir `NEXT_PUBLIC_SITE_URL`. A indexação está desativada em `app/layout.js` enquanto o conteúdo é revisto. Confirmar com documentação os valores técnicos e a eventual garantia remanescente da bateria antes de anunciar essa garantia. Nenhuma garantia remanescente é afirmada nesta versão.

## Verificação

Build de produção concluído. Verificados no browser: vídeos carregam, scroll altera capítulo e tempo dos vídeos, galeria abre/avança/fecha, menu móvel e navegação para contacto, número e mensagem de WhatsApp, ausência de overflow horizontal a 390 px. Sem erros de consola nos fluxos revistos.

## Interior interativo

Cinco pontos diretamente sobre o último frame do vídeo na animação de scroll: patilhas de recuperação, retrovisor virtual na porta direita, climatizador, interface central e painel de instrumentos digital. Ao terminar o vídeo de entrada, o enquadramento abre e fica estável na mesma secção fixa do scroll. Os pontos e descrições funcionam sem mudar de secção nem deslocar a página. Seleção por toque, rato ou teclado, Escape/fechar e navegação alternativa no telemóvel. Continuar o scroll prossegue para o restante site.

Referência técnica para as patilhas: https://www.audi-technology-portal.de/en/drivetrain/electric-drives/audi-e-tron-recuperation

## Tipografia em profundidade

A palavra “e-tron” fica atrás da silhueta na abertura. No interior, “O teu espaço.” acompanha o plano do para-brisas e desaparece antes da exploração dos pontos.



A secção da estrada usa apenas tipografia editorial sobre o vídeo. Foram retirados os efeitos de rodas azuis, anéis e a palavra projetada no asfalto.

O enquadramento da estrada voltou a ocupar toda a área fixa em todos os tamanhos, com o mesmo recorte contínuo do vídeo de entrada no interior.

Mobile: estrada e interior partilham o mesmo plano de vídeo, centrado no ecrã vertical, sem cortar o carro nem mudar de escala no corte entre filmes. A altura fixa usa svh e o progresso usa a altura real da área fixa para não oscilar com as barras do browser. Pontos do interior têm alvos de 44 px, descrições podem deslizar em ecrãs baixos e só são ativados quando o último frame está pronto.

## Equipamento abaixo da abertura

Comparador SUV/Sportback, suspensão pneumática com recriação do Audi drive select, vídeos verticais de jantes e faróis, interior e ficha de equipamento. Os dois vídeos de equipamento são H.264, sem som, e reproduzem apenas enquanto estão visíveis, com controlo de pausa e suporte a movimento reduzido.
