//(BANCO DE DADOS SIMULADO)

let listaOS = [];

// Lista inicial de equipamentos
let listaEquipamentos = [
  { id: 1, nome: "Torno CNC-01", setor: "Usinagem" },
  { id: 2, nome: "Moedor de Gente", setor: "Trituração" },
  { id: 3, nome: "Fresadora F-200", setor: "Acabamento" },
];

// SELETORES GERAIS

// Abas
const btnTabDashboard = document.querySelector(".box-sub-header");
const btnTabEquipamentos = document.querySelector(".box-sub-header-2");
const viewDashboard = document.getElementById("view-dashboard");
const viewEquipamentos = document.getElementById("view-equipamentos");

// Modal OS
const btnAbrirOS = document.getElementById("btn-abrir-card");
const btnFecharOS = document.getElementById("btn-fechar-card");
const overlayOS = document.getElementById("overlay-card");
const formOS = document.getElementById("create-os-card");
const inputsOS = formOS.querySelectorAll("input, select, textarea");

// Modal Equipamentos (novos seletores)
const overlayEquip = document.getElementById("overlay-equip");
const formEquip = document.getElementById("form-equip");
const btnFecharEquip = document.getElementById("btn-fechar-equip");

let osEditando = null;

// SISTEMA DE ABAS

function trocarAba(aba) {
  if (aba === "dashboard") {
    viewEquipamentos.style.display = "none";
    viewDashboard.style.display = "block";
    btnTabDashboard.style.opacity = "1";
    btnTabEquipamentos.style.opacity = "0.5";
    // Atualiza a tabela caso algo tenha mudado
    desenharTabela(listaOS);
    atualizarContadores();
  } else {
    viewDashboard.style.display = "none";
    viewEquipamentos.style.display = "block";
    btnTabEquipamentos.style.opacity = "1";
    btnTabDashboard.style.opacity = "0.5";
    // Desenha os cards atualizados
    desenharEquipamentos();
  }
}

btnTabDashboard.addEventListener("click", () => trocarAba("dashboard"));
btnTabEquipamentos.addEventListener("click", () => trocarAba("equipamentos"));

// LÓGICA DE EQUIPAMENTOS

// Função para desenhar os cards na tela
function desenharEquipamentos() {
  const container = document.querySelector(".equipamentos-container");
  container.innerHTML = ""; // Limpa tudo antes de desenhar

  listaEquipamentos.forEach((equip) => {
    // Verifica se tem OS aberta para essa máquina
    // Se tiver OS aberta (diferente de Concluída), o status é CRÍTICO
    const osAberta = listaOS.find(
      (os) =>
        os.maquina.toLowerCase() === equip.nome.toLowerCase() &&
        os.status !== "Concluída"
    );

    let statusClass = "status-ok";
    let statusTexto = "Operando";
    let icon = "⚙️";

    if (osAberta) {
      statusClass = "status-erro";
      statusTexto = "Parado (OS Aberta)";
      icon = "🚨";
    }

    const card = document.createElement("div");
    card.className = `equip-card ${statusClass}`;

    card.innerHTML = `
            <div class="equip-icon">${icon}</div>
            <div class="equip-info">
                <h3>${equip.nome}</h3>
                <span class="equip-setor">Setor: ${equip.setor}</span>
                <div class="equip-status-badge"><span class="dot"></span> ${statusTexto}</div>
            </div>
            <button class="btn-ver-equip" onclick="filtrarHistorico('${equip.nome}')">Ver Histórico</button>
        `;

    container.appendChild(card);
  });

  // Adiciona o card de "Adicionar Novo" no final
  const btnAdd = document.createElement("div");
  btnAdd.className = "equip-card add-new";
  btnAdd.innerHTML = `<div class="add-icon">+</div><h3>Adicionar Máquina</h3>`;
  btnAdd.addEventListener("click", abrirModalEquip);
  container.appendChild(btnAdd);
}

// Abrir e Fechar Modal de Equipamento
function abrirModalEquip() {
  overlayEquip.classList.add("active");
  formEquip.classList.add("active");
}

function fecharModalEquip() {
  overlayEquip.classList.remove("active");
  formEquip.classList.remove("active");
  formEquip.reset();
}

btnFecharEquip.addEventListener("click", fecharModalEquip);
overlayEquip.addEventListener("click", fecharModalEquip);

// Salvar Novo Equipamento
formEquip.addEventListener("submit", (e) => {
  e.preventDefault();

  const novoEquip = {
    id: Date.now(), // Gera ID único
    nome: formEquip.nomeEquip.value,
    setor: formEquip.setorEquip.value,
  };

  listaEquipamentos.push(novoEquip);
  desenharEquipamentos();
  fecharModalEquip();
});

//Função Inteligente: Ir para Dashboard e Filtrar
window.filtrarHistorico = function (nomeMaquina) {
  trocarAba("dashboard"); // Volta para aba principal
  const inputSearch = document.querySelector(".input-search");
  inputSearch.value = nomeMaquina; // Coloca o nome no campo de busca

  // Simula o evento de digitação para disparar o filtro
  const event = new Event("input");
  inputSearch.dispatchEvent(event);
};

// LÓGICA DE OS (MANTIDA E INTEGRADA)

// Abrir Modal OS
btnAbrirOS.addEventListener("click", () => {
  overlayOS.classList.add("active");
  formOS.classList.add("active");
  document.querySelector(".criar-os-btn").textContent = "Criar OS";

  const selectStatus = formOS.querySelector("select[name='status']");
  selectStatus.style.display = "none";
  if (selectStatus.previousElementSibling)
    selectStatus.previousElementSibling.style.display = "none";
});

// Fechar Modal OS
function fecharModalOS() {
  overlayOS.classList.remove("active");
  formOS.classList.remove("active");
  formOS.classList.remove("vibrate");
  inputsOS.forEach((i) => (i.value = ""));
  formOS.querySelector("select[name='status']").value = "Aberto";
  osEditando = null;
}

btnFecharOS.addEventListener("click", fecharModalOS);
overlayOS.addEventListener("click", fecharModalOS);

// Submit OS
formOS.addEventListener("submit", (event) => {
  event.preventDefault();
  let erro = false;

  inputsOS.forEach((input) => {
    if (input.style.display === "none" || input.offsetParent === null) return;
    if (!input.value.trim()) erro = true;
  });

  if (erro) {
    formOS.classList.remove("vibrate");
    void formOS.offsetWidth;
    formOS.classList.add("vibrate");
    return;
  }

  if (osEditando) atualizarOS();
  else criarOS();
});

function gerarID() {
  return "#" + (2025000 + listaOS.length + 1);
}

function criarOS() {
  const os = {
    id: gerarID(),
    maquina: formOS.maquina.value,
    setor: formOS.setor.value,
    prioridade: formOS.prioridade.value,
    descricao: formOS.descricao.value,
    status: "Aberto",
    data: new Date().toLocaleDateString("pt-BR"),
  };

  listaOS.push(os);
  finalizarAcaoOS();
}

function atualizarOS() {
  osEditando.maquina = formOS.maquina.value;
  osEditando.setor = formOS.setor.value;
  osEditando.prioridade = formOS.prioridade.value;
  osEditando.descricao = formOS.descricao.value;
  osEditando.status = formOS.status.value;

  finalizarAcaoOS();
}

function finalizarAcaoOS() {
  desenharTabela(listaOS);
  atualizarContadores();
  fecharModalOS();
  // Importante: Se eu criei/editei uma OS, o status das máquinas pode ter mudado
  desenharEquipamentos();
}

function desenharTabela(lista) {
  const corpo = document.getElementById("tabelaServicosBody");
  corpo.innerHTML = "";

  if (lista.length === 0) {
    corpo.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">Nenhuma OS cadastrada.</td></tr>`;
    return;
  }

  const mapaStatus = {
    Aberto: "status-aberto",
    "Em Andamento": "status-andamento",
    Concluída: "status-concluida",
  };

  lista.forEach((os) => {
    const tr = document.createElement("tr");
    const statusClass = mapaStatus[os.status] || "status-aberto";

    tr.innerHTML = `
            <td>${os.id}</td>
            <td>${os.maquina}</td>
            <td>${os.setor}</td>
            <td class="prioridade-${os.prioridade.toLowerCase()}">${
      os.prioridade
    }</td>
            <td class="${statusClass}">${os.status}</td>
            <td>${os.data}</td>
            <td><button class="btn-ver">Ver detalhes</button></td>
        `;

    const detalhes = document.createElement("tr");
    detalhes.classList.add("detalhes-row");
    detalhes.style.display = "none";
    detalhes.innerHTML = `
            <td colspan="7">
                <div class="detalhes-card">
                    <div class="detalhes-header"><h3>Detalhes ${os.id}</h3><span>${os.data}</span></div>
                    <div class="detalhes-grid">
                        <div><h4>Máquina</h4><p>${os.maquina}</p></div>
                        <div><h4>Setor</h4><p>${os.setor}</p></div>
                        <div><h4>Prioridade</h4><p>${os.prioridade}</p></div>
                        <div><h4>Status</h4><p>${os.status}</p></div>
                    </div>
                    <div class="detalhes-descricao"><h4>Descrição</h4><p>${os.descricao}</p></div>
                    <div class="detalhes-acoes">
                        <button class="btn-editar">✏ Editar</button>
                        <button class="btn-deletar">&#10060; Deletar</button>
                    </div>
                </div>
            </td>
        `;

    tr.querySelector(".btn-ver").addEventListener("click", (e) => {
      detalhes.style.display =
        detalhes.style.display === "none" ? "table-row" : "none";
    });

    detalhes.querySelector(".btn-editar").addEventListener("click", () => {
      osEditando = os;
      formOS.maquina.value = os.maquina;
      formOS.setor.value = os.setor;
      formOS.prioridade.value = os.prioridade;
      formOS.descricao.value = os.descricao;
      formOS.status.value = os.status;

      const selectStatus = formOS.querySelector("select[name='status']");
      selectStatus.style.display = "block";
      if (selectStatus.previousElementSibling)
        selectStatus.previousElementSibling.style.display = "block";

      overlayOS.classList.add("active");
      formOS.classList.add("active");
      document.querySelector(".criar-os-btn").textContent = "Atualizar OS";
    });

    detalhes.querySelector(".btn-deletar").addEventListener("click", () => {
      if (confirm(`Excluir OS ${os.id}?`)) {
        listaOS = listaOS.filter((item) => item.id !== os.id);
        finalizarAcaoOS();
      }
    });

    corpo.appendChild(tr);
    corpo.appendChild(detalhes);
  });
}

function atualizarContadores() {
  document.querySelector(".num-total-os").textContent = listaOS.length;
  document.querySelector(".box-aberta-os span:last-child").textContent =
    listaOS.filter((os) => os.status === "Aberto").length;
  document.querySelector(".box-andamento-os span:last-child").textContent =
    listaOS.filter((os) => os.status === "Em Andamento").length;
  document.querySelector(".box-concluida-os span:last-child").textContent =
    listaOS.filter((os) => os.status === "Concluída").length;
}

document.querySelector(".input-search").addEventListener("input", (e) => {
  const termo = e.target.value.toLowerCase();
  const filtradas = listaOS.filter(
    (os) =>
      os.maquina.toLowerCase().includes(termo) ||
      os.setor.toLowerCase().includes(termo) ||
      os.id.toLowerCase().includes(termo)
  );
  desenharTabela(filtradas);
});

// Inicialização
desenharTabela(listaOS);
atualizarContadores();
desenharEquipamentos();
