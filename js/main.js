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

// Materiais necessários para cada item (dados fictícios)
const materiaisNecessarios = {
    pente: { aluminio: 65, fitaIsolante: 3, fitaAdesiva: 3, plastico: 100, borracha: 100 },
    silenciador: { cobre: 65, plastico: 120, garrafa: 1, fitaAdesiva: 3, fitaIsolante: 3, pasta: 2 },
    empunhadora: { plastico: 45, borracha: 45, fitaAdesiva: 1, fitaIsolante: 1, componente: 1 },
    mira: { vidro: 45, plastico: 45, fitaAdesiva: 1, fitaIsolante: 1, bateria: 1, bateriaAA: 1 },
    lanterna: { plastico: 55, vidro: 55, fitaAdesiva: 1, fitaIsolante: 1, bateria: 1, bateriaAA: 1 },
    municao: { cobre: 0.5, aluminio: 0.5, frasco: 0.1 }
};

// Variável para armazenar a categoria selecionada
let categoriaAtual = "CNPJ";

// Função para alterar a categoria
function alterarCategoria(categoria) {
    categoriaAtual = categoria;  // Define a categoria atual
    document.querySelectorAll('.btn-opcao').forEach(button => {
        // Remove a classe 'selecionado' de todas as opções
        button.classList.remove('selecionado');
    });
    // Adiciona a classe 'selecionado' à categoria que foi clicada
    document.querySelector(`[data-categoria="${categoria}"]`).classList.add('selecionado');
    atualizarTotal();  // Atualiza o total com base na nova categoria
}

// Função para alterar a quantidade de um produto
function alterarValor(tipo, contadorId) {
    const contador = document.getElementById(contadorId);
    let valorAtual = parseInt(contador.value);

    // Se o valor não for um número válido, inicializa com 0
    if (isNaN(valorAtual)) {
        valorAtual = 0;
    }

    if (tipo === 1) {
        contador.value = valorAtual + 1;
    } else if (tipo === -1 && valorAtual > 0) {
        contador.value = valorAtual - 1;
    }

    // Garante que a quantidade nunca seja menor que 0
    if (parseInt(contador.value) < 0) {
        contador.value = 0;
    }

    atualizarTotal();  // Atualiza os totais sempre que houver mudança na quantidade
    atualizarMateriais();  // Atualiza os materiais sempre que houver mudança na quantidade
}

// Função para corrigir valores de entrada manual
function corrigirValor(contadorId) {
    const contador = document.getElementById(contadorId);
    let valorAtual = parseInt(contador.value);

    // Se o valor não for um número válido ou for negativo, corrige para 0
    if (isNaN(valorAtual) || valorAtual < 0) {
        contador.value = 0;
    }

    atualizarTotal();  // Atualiza os totais sempre que houver mudança na quantidade
    atualizarMateriais();  // Atualiza os materiais sempre que houver mudança na quantidade
}

// Função para atualizar os totais de preço (valores)
function atualizarTotal() {
    let totalGeral = 0;
    let totalComAumento = 0;

    Object.keys(precosCategorias[categoriaAtual]).forEach(item => {
        const contador = document.getElementById(`contador${capitalize(item)}`);
        if (!contador) return;

        let quantidade = parseInt(contador.value);

        // Se o valor não for válido, ajusta para 0
        if (isNaN(quantidade)) {
            quantidade = 0;
        }

        const preco = precosCategorias[categoriaAtual][item];
        const precoAumentado = precosAumentadosCategorias[categoriaAtual][item];
        const subtotal = quantidade * preco;
        const subtotalAumentado = quantidade * precoAumentado;

        // Atualiza os subtotais nas spans correspondentes
        document.getElementById(`subtotal${capitalize(item)}`).innerText = formatarNumero(subtotal);
        totalGeral += subtotal;
        totalComAumento += subtotalAumentado;
    });

    document.getElementById("total").innerText = formatarNumero(totalGeral);
    document.getElementById("totalAumentado").innerText = formatarNumero(totalComAumento);
}

// Função para atualizar os materiais necessários
function atualizarMateriais() {
    Object.keys(materiaisNecessarios).forEach(item => {
        const contador = document.getElementById(`contador${capitalize(item)}`);
        const quantidade = parseInt(contador.value) || 0;

        let materialText = "";
        for (let material in materiaisNecessarios[item]) {
            const quantidadeMaterial = materiaisNecessarios[item][material] * quantidade;
            materialText += `${quantidadeMaterial} unidades de ${material.charAt(0).toUpperCase() + material.slice(1)} `;
        }

        // Atualiza a quantidade de materiais na interface
        document.getElementById(`materiais${capitalize(item)}`).innerText = materialText.trim();
    });
}

// Função para formatar números para o padrão monetário
function formatarNumero(valor) {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Função para capitalizar a primeira letra de uma string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Função para adicionar eventos de incremento e decremento aos botões
function adicionarEventos() {
    Object.keys(precosCategorias.CPF).forEach(item => {
        const subtrairButton = document.getElementById(`subtrair${capitalize(item)}`);
        const adicionarButton = document.getElementById(`adicionar${capitalize(item)}`);
        const contadorInput = document.getElementById(`contador${capitalize(item)}`);

        if (subtrairButton && adicionarButton && contadorInput) {
            subtrairButton.addEventListener('click', () => alterarValor(-1, `contador${capitalize(item)}`));
            adicionarButton.addEventListener('click', () => alterarValor(1, `contador${capitalize(item)}`));

            // Evento para quando o valor do input de quantidade mudar
            contadorInput.addEventListener('input', () => corrigirValor(`contador${capitalize(item)}`));
        }
    });
}

// Função para adicionar eventos nas categorias
function adicionarEventosCategorias() {
    document.querySelectorAll('.btn-opcao').forEach(button => {
        button.addEventListener('click', () => {
            alterarCategoria(button.dataset.categoria);
        });
    });
}

// Função para atualizar materiais logo ao carregar a página
window.onload = function() {
    adicionarEventosCategorias();
    adicionarEventos();
    atualizarTotal(); // Atualiza o total imediatamente ao carregar a página

    // Verifica se estamos na página de Materiais
    if (window.location.pathname.includes("materiais.html")) {
        atualizarMateriais(); // Atualiza os materiais apenas na página de materiais
    }
};
// GPT

// Função para atualizar os materiais necessários
function atualizarMateriais() {
    let materiaisTotais = {
        aluminio: 0,
        cobre: 0, 
        plastico: 0,
        borracha: 0,
        vidro: 0,
        fitaIsolante: 0,
        fitaAdesiva: 0,
        pasta: 0,
        garrafa: 0, 
        bateria: 0, 
        bateriaAA: 0,
        componente: 0, 
        frasco: 0,
    };

    Object.keys(precosCategorias[categoriaAtual]).forEach(item => {
        const contador = document.getElementById(`contador${capitalize(item)}`);
        const quantidade = parseInt(contador.value) || 0;

        if (materiaisNecessarios[item]) {
            for (let material in materiaisNecessarios[item]) {
                let quantidadeMaterial = materiaisNecessarios[item][material] * quantidade;

                // Arredondamento para exibição apenas para materiais de munição
                if (item === 'municao') {
                    quantidadeMaterial = Math.round(quantidadeMaterial); // Arredonda a quantidade de munição para o inteiro mais próximo
                }

                // Adiciona a quantidade material real no total (sem arredondar para cálculos internos)
                materiaisTotais[material] += materiaisNecessarios[item][material] * quantidade;
            }
        }
    });

    // Agora, arredondamos os totais de cada material antes de exibir
    const materiaisList = document.getElementById("materiaisTotais");
    materiaisList.innerHTML = '';  // Limpa a lista antes de adicionar os novos itens

    for (let material in materiaisTotais) {
        let item = materiaisTotais[material];

        // Arredonda a quantidade total do material para o inteiro mais próximo para exibição
        item = Math.round(item);

        if (item > 0) {
            const li = document.createElement("li");
            li.textContent = `${item} unidades de ${material.charAt(0).toUpperCase() + material.slice(1)}`;
            materiaisList.appendChild(li);
        }
    }
}

// Função para atualizar os totais de preço (valores)
function atualizarTotal() {
    let totalGeral = 0;
    let totalComAumento = 0;

    Object.keys(precosCategorias[categoriaAtual]).forEach(item => {
        const contador = document.getElementById(`contador${capitalize(item)}`);
        if (!contador) return;

        let quantidade = parseInt(contador.value);

        // Se o valor não for válido, ajusta para 0
        if (isNaN(quantidade)) {
            quantidade = 0;
        }

        const preco = precosCategorias[categoriaAtual][item];
        const precoAumentado = precosAumentadosCategorias[categoriaAtual][item];
        const subtotal = quantidade * preco;
        const subtotalAumentado = quantidade * precoAumentado;

        // Atualiza os subtotais nas spans correspondentes
        document.getElementById(`subtotal${capitalize(item)}`).innerText = formatarNumero(subtotal);
        totalGeral += subtotal;
        totalComAumento += subtotalAumentado;
    });

    // Arredonda o total para exibição
    document.getElementById("total").innerText = formatarNumero(Math.round(totalGeral));
    document.getElementById("totalAumentado").innerText = formatarNumero(Math.round(totalComAumento));

    // Chama a função para atualizar a lista de materiais
    atualizarMateriais();
}

// Função para formatar números para o padrão monetário
function formatarNumero(valor) {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
// Função para corrigir valores de entrada manual
function corrigirValor(contadorId) {
    const contador = document.getElementById(contadorId);
    let valorAtual = parseInt(contador.value);

    // Se o valor não for um número válido ou for negativo, corrige para 0
    if (isNaN(valorAtual) || valorAtual < 0) {
        contador.value = 0;
    }

    atualizarTotal();  // Atualiza os totais sempre que houver mudança na quantidade
}



