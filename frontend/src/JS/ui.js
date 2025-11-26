import api from "./api.js";


//DATA MODELO BRASILEIRO


function formatarDataBrasileira(iso) {
    if (!iso) return "";
    const data = new Date(iso);

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}









// --- ESTADO GLOBAL ---
let listaOS = [];
let listaEquipamentos = [];
let osEditando = null;

// --- SELETORES ---
const btnTabDashboard = document.querySelector(".box-sub-header");
const btnTabEquipamentos = document.querySelector(".box-sub-header-2");
const viewDashboard = document.getElementById("view-dashboard");
const viewEquipamentos = document.getElementById("view-equipamentos");

// Modal OS
const btnAbrirOS = document.getElementById("btn-abrir-card");
const btnFecharOS = document.getElementById("btn-fechar-card");
const overlayOS = document.getElementById("overlay-card");
const formOS = document.getElementById("create-os-card");
const inputsOS = formOS ? formOS.querySelectorAll("input, select, textarea") : [];

// Modal Equipamentos
const overlayEquip = document.getElementById("overlay-equip");
const formEquip = document.getElementById("form-equip");
const btnFecharEquip = document.getElementById("btn-fechar-equip");

export async function init() {
    console.log("Iniciando UI...");
    await carregarDados();
}

async function carregarDados() {
    try {
        const ordens = await api.ObterOrdens();
        const equips = await api.Obtercaixas();

        listaOS = Array.isArray(ordens) ? ordens : [];
        listaEquipamentos = Array.isArray(equips) ? equips : [];

        desenharTabela(listaOS);
        atualizarContadores();
        desenharEquipamentos();
    } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
    }
}


// --- SISTEMA DE ABAS ---
function trocarAba(aba) {
    if(!viewDashboard || !viewEquipamentos) return;

    if (aba === "dashboard") {
        viewEquipamentos.style.display = "none";
        viewDashboard.style.display = "block";
        btnTabDashboard.style.opacity = "1";
        btnTabEquipamentos.style.opacity = "0.5";
        desenharTabela(listaOS);
        atualizarContadores();
    } else {
        viewDashboard.style.display = "none";
        viewEquipamentos.style.display = "block";
        btnTabEquipamentos.style.opacity = "1";
        btnTabDashboard.style.opacity = "0.5";
        desenharEquipamentos();
    }
}

if(btnTabDashboard) btnTabDashboard.addEventListener("click", () => trocarAba("dashboard"));
if(btnTabEquipamentos) btnTabEquipamentos.addEventListener("click", () => trocarAba("equipamentos"));


// --- LÓGICA DE EQUIPAMENTOS ---
function desenharEquipamentos() {
    const container = document.querySelector(".equipamentos-container");
    if(!container) return;
    container.innerHTML = "";

    listaEquipamentos.forEach((equip) => {
        const osAberta = listaOS.find(
            (os) => os.maquina && equip.nome && 
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
                <h3>${equip.nome || 'Sem Nome'}</h3>
                <span class="equip-setor">Setor: ${equip.setor || '-'}</span>
                <div class="equip-status-badge">${statusTexto}</div>
            </div>
            <button class="btn-ver-equip" onclick="window.filtrarHistorico('${equip.nome}')">Ver Histórico</button>
        `;
        container.appendChild(card);
    });

    const btnAdd = document.createElement("div");
    btnAdd.className = "equip-card add-new";
    btnAdd.innerHTML = `<div class="add-icon">+</div><h3>Adicionar Máquina</h3>`;
    btnAdd.addEventListener("click", abrirModalEquip);
    container.appendChild(btnAdd);
}

function abrirModalEquip() {
    overlayEquip.classList.add("active");
    formEquip.classList.add("active");
}

function fecharModalEquip() {
    overlayEquip.classList.remove("active");
    formEquip.classList.remove("active");
    formEquip.reset();
}

if(btnFecharEquip) btnFecharEquip.addEventListener("click", fecharModalEquip);
if(overlayEquip) overlayEquip.addEventListener("click", fecharModalEquip);

if(formEquip) {
    formEquip.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Correção para pegar inputs pelo name no formEquip também
        const nomeInput = formEquip.querySelector("input[name='nomeEquip']");
        const setorInput = formEquip.querySelector("input[name='setorEquip']");

        const novoEquip = {
            nome: nomeInput ? nomeInput.value : "",
            setor: setorInput ? setorInput.value : "",
        };
        
        await api.Novacaixa(novoEquip);
        await carregarDados();
        fecharModalEquip();
    });
}

// Filtro Global
window.filtrarHistorico = function (nomeMaquina) {
    trocarAba("dashboard");
    const inputSearch = document.querySelector(".input-search");
    if(inputSearch){
        inputSearch.value = nomeMaquina;
        const event = new Event("input");
        inputSearch.dispatchEvent(event);
    }
};


// --- LÓGICA DE OS (AQUI ESTÁ A CORREÇÃO PRINCIPAL) ---

// Abrir Modal
if(btnAbrirOS) {
    btnAbrirOS.addEventListener("click", () => {
        overlayOS.classList.add("active");
        formOS.classList.add("active");
        osEditando = null; // Garante que é uma nova OS
        document.querySelector(".criar-os-btn").textContent = "Criar OS";

        const selectStatus = formOS.querySelector("select[name='status']");
        if(selectStatus) {
            selectStatus.style.display = "none";
            if (selectStatus.previousElementSibling)
                selectStatus.previousElementSibling.style.display = "none";
        }
    });
}

// Fechar Modal
function fecharModalOS() {
    if(!overlayOS) return;
    overlayOS.classList.remove("active");
    formOS.classList.remove("active");
    formOS.classList.remove("vibrate");
    
    // Limpa os campos
    const inputs = formOS.querySelectorAll("input, textarea");
    inputs.forEach(i => i.value = "");
    
    const statusSelect = formOS.querySelector("select[name='status']");
    if(statusSelect) statusSelect.value = "Aberto";
    
    osEditando = null;
}

if(btnFecharOS) btnFecharOS.addEventListener("click", fecharModalOS);
if(overlayOS) overlayOS.addEventListener("click", fecharModalOS);

// === EVENTO DE SUBMIT (A SOLUÇÃO) ===
if(formOS) {
    formOS.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("Iniciando envio do formulário...");

        // 1. Captura Robusta usando querySelector e atributo name
        const inputMaquina = formOS.querySelector("input[name='maquina']");
        const inputSetor = formOS.querySelector("input[name='setor']");
        const inputPrioridade = formOS.querySelector("select[name='prioridade']");
        const inputDescricao = formOS.querySelector("textarea[name='descricao']");
        const inputStatus = formOS.querySelector("select[name='status']");

        // 2. Monta o Objeto
        const dadosForm = {
            maquina: inputMaquina ? inputMaquina.value : "",
            setor: inputSetor ? inputSetor.value : "",
            prioridade: inputPrioridade ? inputPrioridade.value : "Baixa",
            descricao: inputDescricao ? inputDescricao.value : "",
            status: osEditando && inputStatus ? inputStatus.value : "Aberto",
            data: osEditando ? osEditando.data : new Date().toISOString()
        };

        // Log para conferir se os dados foram capturados
        console.log("📦 Payload capturado:", dadosForm);

        // Validação Simples
        if (!dadosForm.maquina || !dadosForm.setor) {
            alert("Preencha Máquina e Setor!");
            formOS.classList.add("vibrate");
            setTimeout(() => formOS.classList.remove("vibrate"), 500);
            return;
        }

        try {
            if (osEditando) {
                // Atualizar
                console.log("Atualizando ID:", osEditando._id || osEditando.id);
                await api.atualizaOrdem(osEditando._id || osEditando.id, dadosForm);
            } else {
                // Criar
                console.log("Criando nova OS...");
                await api.NovaOrdem(dadosForm);
            }
            
            // Sucesso
            await carregarDados(); 
            fecharModalOS();
            alert("Salvo com sucesso!");
            
        } catch (error) {
            console.error("❌ Erro ao salvar:", error);
            alert("Erro ao salvar operação");
        }
    });
}

function desenharTabela(lista) {
    const corpo = document.getElementById("tabelaServicosBody");
    if(!corpo) return;
    corpo.innerHTML = "";

    if (!lista || lista.length === 0) {
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
        
        const idVisivel = (os._id || os.id || "???").toString().slice(-4);

       tr.innerHTML = `
    <td>#..${idVisivel}</td>
    <td>${os.maquina}</td>
    <td>${os.setor}</td>
    <td class="prioridade-${os.prioridade ? os.prioridade.toLowerCase() : 'baixa'}">${os.prioridade}</td>
    <td class="${statusClass}">${os.status}</td>
    <td>${formatarDataBrasileira(os.data)}</td>
    <td><button class="btn-ver">Ver detalhes</button></td>
`;


        const detalhes = document.createElement("tr");
        detalhes.classList.add("detalhes-row");
        detalhes.style.display = "none";
        detalhes.innerHTML = `
    <td colspan="7">
        <div class="detalhes-card">
            <div class="detalhes-header">
                <h3>Detalhes</h3>
                <span>${formatarDataBrasileira(os.data)}</span>
            </div>
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

        tr.querySelector(".btn-ver").addEventListener("click", () => {
            detalhes.style.display = detalhes.style.display === "none" ? "table-row" : "none";
        });

        // Botão Editar (Preenche o formulário para edição)
        detalhes.querySelector(".btn-editar").addEventListener("click", () => {
            osEditando = os;
            
            // Preenche usando querySelector para garantir
            const inMaq = formOS.querySelector("input[name='maquina']");
            const inSetor = formOS.querySelector("input[name='setor']");
            const inPrio = formOS.querySelector("select[name='prioridade']");
            const inDesc = formOS.querySelector("textarea[name='descricao']");
            const inStatus = formOS.querySelector("select[name='status']");

            if(inMaq) inMaq.value = os.maquina;
            if(inSetor) inSetor.value = os.setor;
            if(inPrio) inPrio.value = os.prioridade;
            if(inDesc) inDesc.value = os.descricao;
            
            if(inStatus) {
                inStatus.style.display = "block";
                if(inStatus.previousElementSibling) inStatus.previousElementSibling.style.display = "block";
                inStatus.value = os.status;
            }

            overlayOS.classList.add("active");
            formOS.classList.add("active");
            document.querySelector(".criar-os-btn").textContent = "Atualizar OS";
        });

        detalhes.querySelector(".btn-deletar").addEventListener("click", async () => {
            if (confirm(`Excluir OS da máquina ${os.maquina}?`)) {
                await api.deleteOrdem(os._id || os.id);
                await carregarDados();
            }
        });

        corpo.appendChild(tr);
        corpo.appendChild(detalhes);
    });
}

function atualizarContadores() {
    const totalEl = document.querySelector(".num-total-os");
    if(totalEl) totalEl.textContent = listaOS.length;

    const boxAberta = document.querySelector(".box-aberta-os span:last-child");
    const boxAndamento = document.querySelector(".box-andamento-os span:last-child");
    const boxConcluida = document.querySelector(".box-concluida-os span:last-child");

    if(boxAberta) boxAberta.textContent = listaOS.filter(os => os.status === "Aberto").length;
    if(boxAndamento) boxAndamento.textContent = listaOS.filter(os => os.status === "Em Andamento").length;
    if(boxConcluida) boxConcluida.textContent = listaOS.filter(os => os.status === "Concluída").length;
}

const searchInput = document.querySelector(".input-search");
if(searchInput) {
    searchInput.addEventListener("input", (e) => {
        const termo = e.target.value.toLowerCase();
        const filtradas = listaOS.filter((os) =>
            (os.maquina && os.maquina.toLowerCase().includes(termo)) ||
            (os.setor && os.setor.toLowerCase().includes(termo))
        );
        desenharTabela(filtradas);
    });
}