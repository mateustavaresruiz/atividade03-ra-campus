# RA Campus Anchieta — Atividade 03 (Realidade Aumentada Markerless)

App web de realidade aumentada por GPS: mostra um pino (modelo `map_pin.fbx`) sobre cada
prédio do campus Prof. Pedro C. Fornari (UniAnchieta, Jundiaí) com o nome logo acima.

## Páginas

| Endereço | Uso |
|---|---|
| `index.html` | App no campus (GPS real) |
| `index.html?teste=1` | Espalha os pontos em volta de onde você está (testar em casa) |
| `index.html?simular=1` | Finge estar no campus (testar no computador) |
| `calibrar.html` | Ajusta a posição de cada prédio no local e avisa pontos a menos de 50 m |

## Arquivos

- `index.html` — cena A-Frame + AR.js, painel com distâncias
- `componentes.js` — componentes `marcador-pino`, `rotulo` e `gerenciador-pontos`
- `pontos.js` — coordenadas dos prédios (OpenStreetMap) e cálculo de distância
- `calibrar.html` — calibração no campus
- `modelos/map_pin.fbx` — marcador fornecido pelo professor

## Rodar

Câmera e GPS só funcionam em HTTPS (ou `localhost`). Publicado no GitHub Pages:
abra o link no celular (Chrome no Android ou Safari no iPhone) e permita câmera,
localização e sensores de movimento.

Teste local no computador:

```
python -m http.server 8000
```

e abra `http://localhost:8000/index.html?simular=1`.
