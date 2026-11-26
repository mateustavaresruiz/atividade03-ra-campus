// Componentes A-Frame do app de RA Markerless.
//  - marcador-pino:   carrega o modelo map_pin.fbx (uma vez) e coloca uma cópia no ponto
//  - rotulo:          nome do prédio acima do pino, sempre virado para a câmera
//  - gerenciador-pontos: cria os pontos a partir do GPS e atualiza o painel

const PARAMS = new URLSearchParams(location.search);
const MODO_TESTE = PARAMS.has("teste");   // pontos em volta de onde você está
const SIMULAR = PARAMS.has("simular");    // finge estar no campus (teste no PC)

// ---------------------------------------------------------------- modelo do pino
let promessaPino = null;
function carregarPino() {
  if (!promessaPino) {
    promessaPino = new Promise((ok, erro) => {
      new THREE.FBXLoader().load("modelos/map_pin.fbx", (obj) => {
        // Normaliza: altura 1 e base do pino no chão (y = 0)
        const caixa = new THREE.Box3().setFromObject(obj);
        const tamanho = caixa.getSize(new THREE.Vector3());
        const escala = 1 / tamanho.y;
        obj.scale.setScalar(escala);
        const caixa2 = new THREE.Box3().setFromObject(obj);
        const centro = caixa2.getCenter(new THREE.Vector3());
        obj.position.set(-centro.x, -caixa2.min.y, -centro.z);
        // Garante a cor vermelha do marcador
        obj.traverse((m) => {
          if (m.isMesh) m.material = new THREE.MeshStandardMaterial({
            color: 0xd62828, roughness: 0.4, metalness: 0.1 });
        });
        const grupo = new THREE.Group(); grupo.add(obj);
        ok(grupo);
      }, undefined, erro);
    });
  }
  return promessaPino;
}

AFRAME.registerComponent("marcador-pino", {
  init() {
    carregarPino()
      .then((modelo) => this.el.setObject3D("mesh", modelo.clone(true)))
      .catch((e) => {
        console.warn("[RA] FBX falhou, usando cone:", e);
        // Se o FBX falhar, usa um cone vermelho no lugar
        const cone = document.createElement("a-cone");
        cone.setAttribute("radius-bottom", 0); cone.setAttribute("radius-top", 0.35);
        cone.setAttribute("height", 1); cone.setAttribute("position", "0 0.5 0");
        cone.setAttribute("color", "#d62828");
        this.el.appendChild(cone);
      });
  },
  tick() {
    // gira devagar para chamar atenção
    this.el.object3D.rotation.y += 0.01;
  },
});

// ---------------------------------------------------------------- rótulo
AFRAME.registerComponent("rotulo", {
  schema: { texto: { type: "string" } },
  init() {
    // Desenha o texto num canvas (aceita acentos: "Prédio")
    const c = document.createElement("canvas");
    c.width = 512; c.height = 128;
    const g = c.getContext("2d");
    g.fillStyle = "rgba(0, 40, 90, 0.85)";
    g.beginPath(); g.roundRect ? g.roundRect(4, 4, 504, 120, 24) : g.rect(4, 4, 504, 120); g.fill();
    g.fillStyle = "#ffffff"; g.font = "bold 56px Arial";
    g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(this.data.texto, 256, 66, 480);
    const textura = new THREE.CanvasTexture(c);
    const plano = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.5),
      new THREE.MeshBasicMaterial({ map: textura, transparent: true, side: THREE.DoubleSide }));
    this.el.setObject3D("mesh", plano);
  },
  tick() {
    // "billboard": sempre de frente para a câmera
    const cam = this.el.sceneEl.camera;
    if (cam) this.el.object3D.lookAt(cam.getWorldPosition(new THREE.Vector3()));
  },
});

// ---------------------------------------------------------------- pontos + painel
AFRAME.registerComponent("gerenciador-pontos", {
  init() {
    this.pontos = [];
    this.criados = false;
    this.status = document.getElementById("status");
    this.lista = document.getElementById("lista");

    const camera = this.el.querySelector("[gps-new-camera]");

    // Primeiro escuta a posição; só depois liga o GPS simulado (o evento é imediato)
    camera.addEventListener("gps-camera-update-position", (e) => {
      const { latitude, longitude } = e.detail.position;
      this.posicao = { lat: latitude, lon: longitude };
      if (!this.criados) this.criarPontos(latitude, longitude);
      this.atualizarPainel();
    });

    // ?simular=1 -> finge estar no campus (no campo, ao sul, olhando para os prédios).
    // Serve para testar no computador e mostrar o app fora do campus.
    this.precisao = null;
    if (SIMULAR) {
      const simular = () => camera.setAttribute("gps-new-camera",
        { simulateLatitude: -23.21700, simulateLongitude: -46.89220 });
      if (this.el.hasLoaded) setTimeout(simular, 0);
      else this.el.addEventListener("loaded", simular);
      this.precisao = 0;
    } else if (navigator.geolocation) {
      // Nós mesmos lemos o GPS a cada 3 s e entregamos a posição ao AR.js.
      // Motivos: em alguns celulares o watchPosition (usado pelo AR.js) nunca responde,
      // e o AR.js descarta leituras com precisão pior que 100 m (comum em casa).
      const aplicar = (p) => {
        const { latitude, longitude, accuracy } = p.coords;
        // Modo teste: congela na primeira leitura (em casa o GPS "pula" centenas de metros)
        if (MODO_TESTE && this.criados) return;
        this.precisao = accuracy;
        // 1) entrega a posição ao AR.js (move a câmera virtual)
        camera.setAttribute("gps-new-camera",
          { simulateLatitude: latitude, simulateLongitude: longitude });
        // 2) não depende do aviso do AR.js: cria os pinos e atualiza o painel aqui mesmo
        this.posicao = { lat: latitude, lon: longitude };
        if (!this.criados) this.criarPontos(latitude, longitude);
        this.atualizarPainel();
      };
      const erro = (e) => {
        const motivos = { 1: "permissão de localização negada — libere no cadeado ao lado do endereço",
                          2: "localização indisponível — ligue o GPS/localização do celular",
                          3: "o GPS demorou para responder — tente em lugar aberto" };
        if (!this.criados) this.status.textContent = "Erro de GPS: " + (motivos[e.code] || e.message);
      };
      const ler = () => navigator.geolocation.getCurrentPosition(aplicar, erro,
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });

      // Começa com a posição que o botão INICIAR já obteve (se houver).
      // Se a cena já terminou de carregar, começa na hora; senão, espera o "loaded".
      const comecar = () => {
        this.status.textContent = "v7 — GPS recebido, criando os pontos...";
        if (window.posicaoInicial) aplicar(window.posicaoInicial);
        ler();
        setInterval(ler, 3000);
      };
      if (this.el.hasLoaded) setTimeout(comecar, 0);
      else this.el.addEventListener("loaded", comecar);
    } else {
      this.status.textContent = "Este navegador não tem GPS (geolocalização).";
    }

  },

  criarPontos(latAtual, lonAtual) {
    let pontos = carregarPontos().filter((p) => p.lat && p.lon);

    // Modo teste: espalha os pontos em círculo a 60-120 m de onde você está
    if (MODO_TESTE) {
      const base = carregarPontos();
      pontos = base.map((p, i) => {
        const ang = (i / base.length) * 2 * Math.PI;
        const dist = 60 + (i % 3) * 30;                       // 60, 90, 120 m
        const dLat = (dist * Math.cos(ang)) / 111320;
        const dLon = (dist * Math.sin(ang)) / (111320 * Math.cos(latAtual * Math.PI / 180));
        return { nome: p.nome, lat: latAtual + dLat, lon: lonAtual + dLon };
      });
    }

    const cena = this.el;
    pontos.forEach((p, i) => {
      const lugar = document.createElement("a-entity");
      lugar.setAttribute("gps-new-entity-place", { latitude: p.lat, longitude: p.lon });

      const pino = document.createElement("a-entity");
      pino.setAttribute("marcador-pino", "");
      lugar.appendChild(pino);

      const nome = document.createElement("a-entity");
      nome.setAttribute("rotulo", { texto: p.nome });
      // logo acima do pino; alturas alternadas para nomes de prédios alinhados não se cobrirem
      nome.setAttribute("position", `0 ${1.4 + (i % 4) * 0.55} 0`);
      lugar.appendChild(nome);

      cena.appendChild(lugar);
      this.pontos.push({ ...p, el: lugar });
    });
    this.criados = true;
  },

  atualizarPainel() {
    if (!this.posicao) return;
    const { lat, lon } = this.posicao;
    const prec = this.precisao == null ? "?" : Math.round(this.precisao);
    const itens = this.pontos
      .map((p) => ({ nome: p.nome, d: distanciaMetros(lat, lon, p.lat, p.lon), el: p.el }))
      .sort((a, b) => a.d - b.d);

    // Escala cresce com a distância (para ser visível de longe), mas menos que a
    // distância: assim o prédio mais longe aparece menor e os rótulos não se cobrem.
    itens.forEach((p) => p.el.object3D.scale.setScalar(Math.max(4, 1.2 * Math.sqrt(p.d))));

    const modo = MODO_TESTE ? " — MODO TESTE" : SIMULAR ? " — SIMULADO NO CAMPUS" : "";
    if (!itens.length) {
      this.status.innerHTML = `GPS ±${prec} m${modo} — nenhum ponto configurado. Use Calibrar.`;
      return;
    }
    this.status.innerHTML =
      `GPS ±${prec} m${modo} — mais perto: <b>${itens[0].nome}</b> (${Math.round(itens[0].d)} m)`;
    this.lista.textContent = itens.map((p) => `${p.nome}: ${Math.round(p.d)} m`).join(" · ");
  },
});
