# Roteiro do vídeo — RA Markerless (3 a 4 min)

O enunciado pede: **explicação do grupo sobre a aplicação + filmagem dos pontos sendo localizados.**

## Antes de ir ao campus
- Celular carregado, dados móveis ligados, link aberto uma vez em casa com `?teste=1`
  para já aceitar as permissões (câmera, localização, movimento).
- Para gravar a tela do celular: Android → "Gravar tela" no menu rápido;
  iPhone → "Gravação de Tela" na Central de Controle.

## Parte 1 — Explicação (1 min, pode ser no PC, gravando com Win+Alt+R)
1. "Sou Mateus Tavares Ruiz, RA 2300567c. Este é o app de Realidade Aumentada Markerless
   da Atividade 03."
2. Mostre o GitHub (`github.com/mateustavaresruiz/atividade03-ra-campus`) e fale:
   - "É um app web feito com A-Frame e AR.js. Roda no navegador do celular, sem instalar nada."
   - "É markerless: não usa marcador impresso. A posição vem do GPS e a direção da bússola."
   - "`pontos.js` tem as coordenadas dos prédios, tiradas do OpenStreetMap."
   - "`componentes.js` carrega o pino 3D do professor, desenha o nome acima e calcula as distâncias."

## Parte 2 — No campus (2 a 3 min, gravando a tela do celular)
1. Abra `mateustavaresruiz.github.io/atividade03-ra-campus` e espere a precisão do GPS
   no topo ficar abaixo de ~15 m.
2. Fique em um ponto aberto (ex.: perto do Anfiteatro) e gire devagar mostrando cada prédio:
   pino + nome aparecendo, e o painel com a distância.
3. Ande até outro ponto (ex.: entre o Prédio 1 e o Prédio 3) e mostre os outros prédios.
4. Mostre o painel mudando: "mais perto: Prédio X".

## Encerramento (15 s)
"O app localiza os 7 pontos do mapa — Prédios 1 a 4, Biblioteca, Administrativo e Anfiteatro —
mostrando o marcador e o nome de cada um. Obrigado."

## Se algum pino estiver deslocado
Abra `calibrar.html`, fique na frente do prédio e toque em "Salvar aqui". Volte ao app.
