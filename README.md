# RA Campus Anchieta — Atividade 03 (Realidade Aumentada Markerless)

App web de realidade aumentada por localização, como um "Maps" na câmera: aponte o celular
e veja um pino com o nome e a distância de cada prédio do campus Prof. Pedro C. Fornari
(UniAnchieta, Jundiaí). Quando o prédio está fora da tela, uma seta na borda mostra para
que lado virar.

- Mostra os 7 pontos: Prédios 1 a 4, Biblioteca, Prédio Administrativo e Anfiteatro.
- De longe, um pino só com os nomes em coluna; de perto, um pino por prédio.

App: https://mateustavaresruiz.github.io/atividade03-ra-campus/

## Arquivos

- `index.html` — câmera, GPS, bússola, cálculo de direção e desenho dos pinos e setas
- `pontos.js` — coordenadas dos prédios (OpenStreetMap) e cálculo de distância
- `modelos/map_pin.fbx` — marcador fornecido pelo professor
- `modelos/pino.png` — imagem do mesmo marcador, usada na tela
- `docs/` — documentação (PDF), link do projeto e roteiro do vídeo

## Usar

Abra o link no celular (Chrome no Android, Safari no iPhone), toque em INICIAR e permita
câmera, localização e movimento. Câmera e GPS exigem HTTPS, que o GitHub Pages fornece.
