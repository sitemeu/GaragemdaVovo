const cardapio = {
    Lanches: [
        { nome: "X-Salada", preco: 20 },
        { nome: "X-Bacon", preco: 25 },
        { nome: "X-Tudo", preco: 30 }
    ],
    Porções: [
        { nome: "Batata Inteira", preco: 30 },
        { nome: "Batata Meia", preco: 18 }
    ],
    Bebidas: [
        { nome: "Coca-Cola 2L", preco: 15 },
        { nome: "Guaraná Lata", preco: 6 }
    ]
};

const totalMesas = 6;  // número de mesas exibidas
let mesaAtual = null;
let comandas = {};
let vendas = [];

function criarCardsMesas() {
    const listaMesas = document.getElementById("listaMesas");
    listaMesas.innerHTML = "";

    // Adiciona o card fixo de Pedido Avulso
    const cardAvulso = document.createElement("div");
    cardAvulso.className = "mesa-card mesa-avulso";
    cardAvulso.innerHTML = `<strong>Pedido Avulso</strong><br><span style="font-size: 14px; color: #e0d7f5;">🟣 Avulso</span>`;
    cardAvulso.onclick = () => abrirMesa("avulso");
    listaMesas.appendChild(cardAvulso);

    // Cria as mesas numeradas
    for (let i = 1; i <= totalMesas; i++) {
        const card = document.createElement("div");
        card.className = "mesa-card";

        const numeroMesa = i.toString();
        const temComanda = comandas[numeroMesa] && comandas[numeroMesa].length > 0;

        if (temComanda) {
            card.classList.add("mesa-ocupada");
            card.innerHTML = `<strong>Mesa ${i}</strong><br><span style="font-size: 14px; color: #fff;">🔴 Ocupada</span>`;
        } else {
            card.classList.add("mesa-livre");
            card.innerHTML = `<strong>Mesa ${i}</strong><br><span style="font-size: 14px; color: #d4fcdc;">🟢 Livre</span>`;
        }

        card.onclick = () => abrirMesa(i);
        listaMesas.appendChild(card);
    }
}

function abrirMesa(numero) {
    mesaAtual = numero.toString();
    if (!comandas[mesaAtual]) comandas[mesaAtual] = [];

    document.getElementById("mesas").style.display = "none";
    const painel = document.getElementById("painelMesa");
    painel.style.display = "block";
    document.getElementById("tituloMesa").innerText =
        mesaAtual === "avulso" ? "Pedido Avulso" : `Mesa ${mesaAtual}`;

    montarCardapio();
    atualizarComanda();
    iniciarContadorTempo();
}

function voltarMesas() {
    mesaAtual = null;
    document.getElementById("painelMesa").style.display = "none";
    document.getElementById("mesas").style.display = "block";
    pararContadorTempo();

}

function montarCardapio() {
    const categoriasDiv = document.getElementById("categorias");
    categoriasDiv.innerHTML = "";

    for (let categoria in cardapio) {
        const catDiv = document.createElement("div");
        const titulo = document.createElement("h3");
        titulo.innerText = categoria;
        catDiv.appendChild(titulo);

        cardapio[categoria].forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "item";
            itemDiv.innerHTML = `<span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>`;
            const btn = document.createElement("button");
            btn.innerText = "Adicionar";
            btn.onclick = () => adicionarItem(categoria, index);
            itemDiv.appendChild(btn);
            catDiv.appendChild(itemDiv);
        });

        categoriasDiv.appendChild(catDiv);
    }
}

function adicionarItem(categoria, index) {
    if (!mesaAtual) {
        alert("Selecione uma mesa.");
        return;
    }
    const item = cardapio[categoria][index];
    comandas[mesaAtual].push(item);
    atualizarComanda();
    criarCardsMesas();
    salvarDados();
}

function atualizarComanda() {
    const lista = document.getElementById("itensComanda");
    lista.innerHTML = "";
    if (!mesaAtual || !comandas[mesaAtual]) return;

    let total = 0;
    const contagem = {};

    // Conta quantos de cada item
    comandas[mesaAtual].forEach(item => {
        total += item.preco;
        contagem[item.nome] = contagem[item.nome] || {
            quantidade: 0,
            preco: item.preco
        };
        contagem[item.nome].quantidade++;
    });

    for (let nome in contagem) {
        const info = contagem[nome];
        const valorTotal = info.quantidade * info.preco;

        const li = document.createElement("li");
        li.innerHTML = `${info.quantidade}x ${nome} - R$ ${valorTotal.toFixed(2)} `;

        // Cria botão de remover
        const btnRemover = document.createElement("button");
        btnRemover.innerText = "Remover";
        btnRemover.style.backgroundColor = "#dc3545"; // vermelho
        btnRemover.style.marginLeft = "10px";
        btnRemover.onclick = () => removerItem(nome);

        li.appendChild(btnRemover);
        lista.appendChild(li);
    }

    document.getElementById("totalComanda").innerText = `Total: R$ ${total.toFixed(2)}`;
}

function removerItem(nome) {
    if (!mesaAtual || !comandas[mesaAtual]) return;

    // Remove só o primeiro item com esse nome
    const index = comandas[mesaAtual].findIndex(item => item.nome === nome);
    if (index !== -1) {
        comandas[mesaAtual].splice(index, 1);
        atualizarComanda();
        criarCardsMesas();
        salvarDados();
    }
}

function fecharComanda() {
    if (!mesaAtual || !comandas[mesaAtual] || comandas[mesaAtual].length === 0) {
        alert("Nenhuma comanda para fechar.");
        return;
    }

    if (!confirm("Tem certeza que deseja fechar a comanda?")) return;

    const resumo = comandas[mesaAtual];
    let conteudo = `Comanda - ${mesaAtual === "avulso" ? "Pedido Avulso" : "Mesa " + mesaAtual}\n\n`;
    let total = 0;
    const contagem = {};

    resumo.forEach(item => {
        total += item.preco;
        contagem[item.nome] = (contagem[item.nome] || 0) + 1;
    });

    for (let nome in contagem) {
        const precoUnit = resumo.find(i => i.nome === nome).preco;
        conteudo += `${contagem[nome]}x ${nome} - R$ ${(contagem[nome] * precoUnit).toFixed(2)}\n`;
    }

    conteudo += `\nTotal: R$ ${total.toFixed(2)}`;

    // Imprimir automaticamente
    const janela = window.open('', '', 'width=400,height=600');
    janela.document.write(`<pre>${conteudo}</pre>`);
    janela.document.close();
    janela.print();

    // Salvar no histórico e liberar mesa
    vendas.push(...resumo);

    // Limpa o array, mantendo a propriedade para evitar problemas
    comandas[mesaAtual] = [];

    salvarDados();
    voltarMesas();
    atualizarVendas();
    criarCardsMesas();
    pararContadorTempo();
}

function atualizarVendas() {
    const lista = document.getElementById("listaVendas");
    lista.innerHTML = "";
    let total = 0;
    vendas.forEach(item => {
        const li = document.createElement("li");
        li.innerText = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
        lista.appendChild(li);
        total += item.preco;
    });
    document.getElementById("totalDia").innerText = `Total do dia: R$ ${total.toFixed(2)}`;
}

function imprimirComanda() {
    if (!mesaAtual || !comandas[mesaAtual] || comandas[mesaAtual].length === 0) {
        alert("Nenhuma comanda para imprimir.");
        return;
    }

    if (!confirm("Deseja realmente imprimir essa comanda?")) return;

    let conteudo = `Comanda - Mesa ${mesaAtual}\n\n`;
    const itens = comandas[mesaAtual];
    let total = 0;
    const resumo = {};

    itens.forEach(item => {
        total += item.preco;
        resumo[item.nome] = (resumo[item.nome] || 0) + 1;
    });

    for (let nome in resumo) {
        const precoUnit = itens.find(i => i.nome === nome).preco;
        conteudo += `${resumo[nome]}x ${nome} - R$ ${(resumo[nome] * precoUnit).toFixed(2)}\n`;
    }

    conteudo += `\nTotal: R$ ${total.toFixed(2)}`;

    const janela = window.open('', '', 'width=400,height=600');
    janela.document.write(`<pre>${conteudo}</pre>`);
    janela.document.close();
    janela.print();
}

function salvarDados() {
    localStorage.setItem("comandas", JSON.stringify(comandas));
    localStorage.setItem("vendas", JSON.stringify(vendas));
}

function carregarDados() {
    const dadosComandas = localStorage.getItem("comandas");
    const dadosVendas = localStorage.getItem("vendas");

    if (dadosComandas) comandas = JSON.parse(dadosComandas);
    if (dadosVendas) vendas = JSON.parse(dadosVendas);
}

function cancelarComanda() {
    if (!mesaAtual || !comandas[mesaAtual] || comandas[mesaAtual].length === 0) {
        alert("Nenhuma comanda para cancelar.");
        return;
    }

    if (!confirm("Tem certeza que deseja cancelar esta comanda? Os itens serão apagados.")) return;

    delete comandas[mesaAtual];
    voltarMesas();
    criarCardsMesas();
    salvarDados();
}

let intervaloTempo = null; // guarda o timer para poder parar

function iniciarContadorTempo() {
    let segundos = 0;

    function formatarTempo(s) {
        const h = Math.floor(s / 3600).toString().padStart(2, '0');
        const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
        const seg = (s % 60).toString().padStart(2, '0');
        return `${h}:${m}:${seg}`;
    }

    // Limpa timer anterior, se tiver
    if (intervaloTempo) clearInterval(intervaloTempo);

    // Atualiza o tempo a cada 1 segundo
    intervaloTempo = setInterval(() => {
        segundos++;
        document.getElementById("tempoMesa").innerText = formatarTempo(segundos);
    }, 1000);
}

function pararContadorTempo() {
    if (intervaloTempo) {
        clearInterval(intervaloTempo);
        intervaloTempo = null;
    }
    document.getElementById("tempoMesa").innerText = "00:00:00";
}

function mostrarAba(aba) {
    document.getElementById("mesas").style.display = aba === 'mesas' ? 'block' : 'none';
    document.getElementById("avulsos").style.display = aba === 'avulsos' ? 'block' : 'none';
    if (aba === 'avulsos') listarAvulsos();
}

function listarAvulsos() {
    const lista = document.getElementById("listaAvulsos");
    lista.innerHTML = "";

    const pedidos = comandas["avulso"] || [];
    if (pedidos.length === 0) {
        lista.innerHTML = "<li>Nenhum pedido avulso registrado.</li>";
        return;
    }

    const contagem = {};
    let total = 0;

    pedidos.forEach(item => {
        total += item.preco;
        contagem[item.nome] = (contagem[item.nome] || 0) + 1;
    });

    for (let nome in contagem) {
        const li = document.createElement("li");
        const qtd = contagem[nome];
        const preco = pedidos.find(i => i.nome === nome).preco;
        li.textContent = `${qtd}x ${nome} - R$ ${(qtd * preco).toFixed(2)}`;
        lista.appendChild(li);
    }

    const totalLi = document.createElement("li");
    totalLi.style.fontWeight = "bold";
    totalLi.textContent = `Total Avulso: R$ ${total.toFixed(2)}`;
    lista.appendChild(totalLi);
}

// Inicializa
carregarDados();
criarCardsMesas();
atualizarVendas();
