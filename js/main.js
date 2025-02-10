// Jogo "Cara ou Coroa"
function carregarJogo() {
    if (!document.getElementById("modalJogo")) {
        document.getElementById("jogoContainer").innerHTML = `
            <div id="modalJogo" class="modal">
                <div class="modal-content">
                    <span class="fechar" onclick="fecharJogo()">X</span>
                    <h2>Cara ou Coroa?</h2>
                    <button class="game-btn" onclick="jogar('cara')">Cara</button>
                    <button class="game-btn" onclick="jogar('coroa')">Coroa</button>
                    <p id="resultado"></p>
                </div>
            </div>
        `;
    }
}

function abrirJogo() {  
    document.getElementById("modalJogo").style.display = "flex";
}

function fecharJogo() {
    document.getElementById("modalJogo").style.display = "none";
}

// Função de jogo "Cara ou Coroa"
function jogar(escolhaUsuario) {
    const opcoes = ['cara', 'coroa'];
    const resultado = opcoes[Math.floor(Math.random() * 2)];
    const resultadoFinal = resultado === escolhaUsuario ? (resultado === 'cara' ? 'coroa' : 'cara') : resultado;
    document.getElementById("resultado").innerText = `Deu ${resultadoFinal}, você perdeu! Transfira 10.000 reais para o Pedro!`;
}

// Definição dos preços para cada categoria
const precosCategorias = {
    CPF: { pente: 8000, silenciador: 7000, empunhadora: 5000, mira: 5000, lanterna: 4500, municao: 60 },
    CNPJ: { pente: 7500, silenciador: 6500, empunhadora: 4500, mira: 4500, lanterna: 4000, municao: 50 },
    PARCERIA: { pente: 7225, silenciador: 5525, empunhadora: 3825, mira: 3825, lanterna: 3400, municao: 45 }
};

const precosAumentadosCategorias = {
    CPF: { pente: 9600, silenciador: 8400, empunhadora: 6000, mira: 6000, lanterna: 5400, municao: 70 },
    CNPJ: { pente: 9000, silenciador: 7800, empunhadora: 5400, mira: 5400, lanterna: 4800, municao: 60 },
    PARCERIA: { pente: 8650, silenciador: 6650, empunhadora: 4600, mira: 4600, lanterna: 4100, municao: 55 }
};

let categoriaAtual = "CPF";

function alterarCategoria(categoria) {
    categoriaAtual = categoria;
    atualizarTotal();
}

function alterarValor(tipo, contadorId) {
    const contador = document.getElementById(contadorId);
    let valorAtual = parseInt(contador.value);

    if (tipo === 1) {
        contador.value = valorAtual + 1;
    } else if (tipo === -1 && valorAtual > 0) {
        contador.value = valorAtual - 1;
    }
    atualizarTotal();
}

function atualizarTotal() {
    let totalGeral = 0;
    let totalComAumento = 0;

    Object.keys(precosCategorias[categoriaAtual]).forEach(item => {
        const contador = document.getElementById(`contador${capitalize(item)}`);
        if (!contador) return;

        const quantidade = parseInt(contador.value);
        const preco = precosCategorias[categoriaAtual][item];
        const precoAumentado = precosAumentadosCategorias[categoriaAtual][item];
        const subtotal = quantidade * preco;
        const subtotalAumentado = quantidade * precoAumentado;

        document.getElementById(`subtotal${capitalize(item)}`).innerText = `R$ ${subtotal},00`;
        document.getElementById(`subtotalAumentado${capitalize(item)}`).innerText = `R$ ${subtotalAumentado},00`;

        totalGeral += subtotal;
        totalComAumento += subtotalAumentado;
    });

    document.getElementById("total").innerText = `R$ ${totalGeral},00`;
    document.getElementById("totalAumentado").innerText = `R$ ${totalComAumento},00`;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function adicionarEventos() {
    Object.keys(precosCategorias.CPF).forEach(item => {
        const subtrairButton = document.getElementById(`subtrair${capitalize(item)}`);
        const adicionarButton = document.getElementById(`adicionar${capitalize(item)}`);
        const contadorInput = document.getElementById(`contador${capitalize(item)}`);

        if (subtrairButton && adicionarButton && contadorInput) {
            subtrairButton.addEventListener('click', () => alterarValor(-1, `contador${capitalize(item)}`));
            adicionarButton.addEventListener('click', () => alterarValor(1, `contador${capitalize(item)}`));
            contadorInput.addEventListener('input', atualizarTotal);
        }
    });
}

function adicionarEventosCategorias() {
    document.querySelectorAll('.btn-opcao').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.btn-opcao').forEach(b => b.classList.remove('selecionado'));
            button.classList.add('selecionado');
            alterarCategoria(button.dataset.categoria);
        });
    });
}

window.onload = function() {
    adicionarEventosCategorias();
    adicionarEventos();
    atualizarTotal();
};