let avaliacaoAtual = {
    id: "",
    data: "",
    empresa: "",
    municipio: "",
    fazenda: "",
    talhao: "",
    equipe: "",
    quantidade: 10,

    latitude: "",
    longitude: "",
    precisaoGPS: "",

    plantas: []
};

let plantaAtual = 1;
let respostasPlanta = {};


function iniciarAvaliacao() {

    const empresa = document.getElementById("empresa").value;
    const municipio = document.getElementById("municipio").value;
    const fazenda = document.getElementById("fazenda").value;
    const talhao = document.getElementById("talhao").value;
    const equipe = document.getElementById("equipe").value;

 if (
    empresa === "" ||
    municipio === "" ||
    fazenda === "" ||
    talhao === "" ||
    equipe === ""
) {
    alert("Preencha todos os campos.");
    return;
}

avaliacaoAtual.empresa = empresa;
avaliacaoAtual.municipio = municipio;
avaliacaoAtual.fazenda = fazenda;
avaliacaoAtual.talhao = talhao;
avaliacaoAtual.equipe = equipe;

avaliacaoAtual.id = gerarIdAvaliacao();
avaliacaoAtual.data = new Date().toLocaleString("pt-BR");

    const main = document.querySelector("main");

    main.innerHTML = `
        <section class="card">

            <h2>📍 Ponto Amostral</h2>

            <p class="informacao">
    ID da avaliação:
    <strong>${avaliacaoAtual.id}</strong>
</p>

            <p class="informacao">
    Empresa: <strong>${empresa}</strong>
</p>

<p class="informacao">
    Município: <strong>${municipio}</strong>
</p>

            <p class="informacao">
                Fazenda: <strong>${fazenda}</strong>
            </p>

            <p class="informacao">
                Talhão: <strong>${talhao}</strong>
            </p>

            <p class="informacao">
                Equipe: <strong>${equipe}</strong>
            </p>

<div class="campo">
    <label>Quantidade de plantas</label>
    <input type="number" id="quantidade" value="10" min="1">
</div>

<div class="campo">

    <label>📍 Localização do ponto</label>

    <button
        type="button"
        onclick="capturarGPS()">
        📍 Capturar localização GPS
    </button>

    <p id="statusGPS" class="informacao">
        Localização ainda não capturada.
    </p>

    <p class="informacao">
        Latitude:
        <strong id="latitude">-</strong>
    </p>

    <p class="informacao">
        Longitude:
        <strong id="longitude">-</strong>
    </p>

    <p class="informacao">
        Precisão:
        <strong id="precisaoGPS">-</strong>
    </p>

    <div id="mapa"></div>

</div>

<button onclick="iniciarPlantas()">
    Iniciar avaliação das plantas
</button>


        </section>
    `;
}


function iniciarPlantas() {
    const quantidade =
        document.getElementById("quantidade").value;

    if (!avaliacaoAtual.latitude || !avaliacaoAtual.longitude) {
        alert("Capture a localização GPS antes de iniciar a avaliação.");
        return;
    }

    avaliacaoAtual.quantidade = Number(quantidade);
    avaliacaoAtual.plantas = [];

    plantaAtual = 1;

    mostrarPlanta();
}


function mostrarPlanta() {

    respostasPlanta = {};

    const main = document.querySelector("main");

    main.innerHTML = `

        <section class="card">

            <h2>🌱 Avaliação das Plantas</h2>


            <p class="informacao">
                Planta
                <strong>${plantaAtual}</strong>
                de
                <strong>${avaliacaoAtual.quantidade}</strong>
            </p>

            <hr>

            ${criarCriterio("espacamento", "Espaçamento")}

            ${criarCriterio("profundidade", "Profundidade")}

            ${criarCriterio("inclinacao", "Inclinação")}

            ${criarCriterio("torrao", "Torrão")}

            ${criarCriterio("dano", "Dano à planta")}

            ${criarCriterio("alinhamento", "Alinhamento")}

            <button onclick="salvarPlanta()">
                Salvar e próxima planta
            </button>

        </section>
    `;
}


function criarCriterio(nome, titulo) {

    return `
        <div class="avaliacao">

            <label>${titulo}</label>

            <div class="opcoes">

                <button
                    type="button"
                    onclick="selecionar(this, '${nome}', 'Conforme')">
                    Conforme
                </button>

                <button
                    type="button"
                    onclick="selecionar(this, '${nome}', 'Não conforme')">
                    Não conforme
                </button>

            </div>

        </div>
    `;
}


function selecionar(botao, criterio, valor) {

    const grupo = botao.parentElement;

    const botoes = grupo.querySelectorAll("button");

    botoes.forEach(function(item) {
        item.classList.remove("selecionado");
    });

    botao.classList.add("selecionado");

    respostasPlanta[criterio] = valor;
}


function salvarPlanta() {

    const criterios = [
        "espacamento",
        "profundidade",
        "inclinacao",
        "torrao",
        "dano",
        "alinhamento"
    ];

    for (let criterio of criterios) {

        if (!respostasPlanta[criterio]) {

            alert("Responda todos os critérios antes de continuar.");

            return;
        }
    }

    // Conta quantos critérios foram considerados conformes
    let conformes = 0;

    criterios.forEach(function(criterio) {

        if (respostasPlanta[criterio] === "Conforme") {
            conformes++;
        }

    });

    // Calcula a porcentagem de conformidade da planta
    const percentual = (conformes / criterios.length) * 100;

    const planta = {
        numero: plantaAtual,
        respostas: { ...respostasPlanta },
        conformes: conformes,
        percentual: percentual
    };

    avaliacaoAtual.plantas.push(planta);

    if (plantaAtual < avaliacaoAtual.quantidade) {

        plantaAtual++;

        mostrarPlanta();

    } else {

        mostrarResultado();
    }
}


function mostrarResultado() {

    const totalPlantas = avaliacaoAtual.plantas.length;

    const totalCriterios = totalPlantas * 6;

    let totalConformes = 0;

    avaliacaoAtual.plantas.forEach(function(planta) {

        totalConformes += planta.conformes;

    });

    // Calcula a conformidade total
    const percentualTotal =
        (totalConformes / totalCriterios) * 100;

        const criterios = [
    "espacamento",
    "profundidade",
    "inclinacao",
    "torrao",
    "dano",
    "alinhamento"
];

let conformidadeParametros = {};

criterios.forEach(function(criterio) {

    let conformes = 0;

    avaliacaoAtual.plantas.forEach(function(planta) {

        if (planta.respostas[criterio] === "Conforme") {
            conformes++;
        }

    });

    const percentual =
        (conformes / totalPlantas) * 100;

    conformidadeParametros[criterio] = percentual;

});

        avaliacaoAtual.percentualTotal = percentualTotal;
avaliacaoAtual.conformidadeParametros = conformidadeParametros;

salvarAvaliacao();

    // Cria as linhas da tabela
    let tabelaPlantas = "";

    avaliacaoAtual.plantas.forEach(function(planta) {

        const respostas = planta.respostas;

        tabelaPlantas += `
            <tr>

                <td>
                    Planta ${String(planta.numero).padStart(2, "0")}
                </td>

                <td class="${classeResultado(respostas.espacamento)}">
                    ${simboloResultado(respostas.espacamento)}
                </td>

                <td class="${classeResultado(respostas.profundidade)}">
                    ${simboloResultado(respostas.profundidade)}
                </td>

                <td class="${classeResultado(respostas.inclinacao)}">
                    ${simboloResultado(respostas.inclinacao)}
                </td>

                <td class="${classeResultado(respostas.torrao)}">
                    ${simboloResultado(respostas.torrao)}
                </td>

                <td class="${classeResultado(respostas.dano)}">
                    ${simboloResultado(respostas.dano)}
                </td>

                <td class="${classeResultado(respostas.alinhamento)}">
                    ${simboloResultado(respostas.alinhamento)}
                </td>

                <td>
                    <strong>
                        ${planta.percentual.toFixed(1)}%
                    </strong>
                </td>

            </tr>
        `;

    });


    const main = document.querySelector("main");

    main.innerHTML = `

        <section class="card">

            <h2>📊 Resultado da Avaliação</h2>


            <hr>

            <h3>Conformidade por planta</h3>

            <div class="tabela-container">

                <table class="tabela-resultados">

                    <thead>

                        <tr>

                            <th>Planta</th>

                            <th>Espaçamento</th>

                            <th>Profundidade</th>

                            <th>Inclinação</th>

                            <th>Torrão</th>

                            <th>Dano</th>

                            <th>Alinhamento</th>

                            <th>Conformidade</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${tabelaPlantas}

                    </tbody>

                </table>

            </div>


            <div class="legenda">

                <p>✓ Conforme</p>

                <p>✗ Não conforme</p>

            </div>


            <div class="resultado-final">

                <h3>Conformidade total</h3>

                <p class="percentual-total">
                    ${percentualTotal.toFixed(1)}%
                </p>

                <p>
                    ${totalConformes} de ${totalCriterios}
                    critérios conformes
                </p>

            </div>

            <button
    type="button"
    onclick="novaAvaliacao()"
    style="margin-top: 20px;">
    🏠 Voltar à tela inicial
</button>

        </section>
    `;
}


function simboloResultado(resultado) {

    if (resultado === "Conforme") {
        return "✓";
    }

    return "✗";
}


function classeResultado(resultado) {

    if (resultado === "Conforme") {
        return "conforme";
    }

    return "nao-conforme";
}
function salvarAvaliacao() {

    let historico =
        JSON.parse(localStorage.getItem("avaliacoes")) || [];

    historico.push(avaliacaoAtual);

    localStorage.setItem(
        "avaliacoes",
        JSON.stringify(historico)
    );
}
function mostrarHistorico() {

    const historico =
        JSON.parse(localStorage.getItem("avaliacoes")) || [];

    const main = document.querySelector("main");

    if (historico.length === 0) {

        main.innerHTML = `

            <section class="card">

                <h2>📋 Histórico de Avaliações</h2>

                <p>
                    Nenhuma avaliação registrada.
                </p>

                <button onclick="novaAvaliacao()">
                    ➕ Nova avaliação
                </button>

            </section>

        `;

        return;
    }

    let linhas = "";

   historico.forEach(function(avaliacao) {

    const parametros = avaliacao.conformidadeParametros || {};

    linhas += `

        <tr>

            <td>${avaliacao.data}</td>

            <td>${avaliacao.fazenda}</td>

            <td>${avaliacao.talhao}</td>

            <td>${avaliacao.equipe}</td>

        
            <td>
                <strong>
                    ${Number(avaliacao.percentualTotal).toFixed(1)}%
                </strong>
            </td>

            <td>
                ${Number(parametros.espacamento || 0).toFixed(1)}%
            </td>

            <td>
                ${Number(parametros.profundidade || 0).toFixed(1)}%
            </td>

            <td>
                ${Number(parametros.inclinacao || 0).toFixed(1)}%
            </td>

            <td>
                ${Number(parametros.torrao || 0).toFixed(1)}%
            </td>

            <td>
                ${Number(parametros.dano || 0).toFixed(1)}%
            </td>

            <td>
                ${Number(parametros.alinhamento || 0).toFixed(1)}%
            </td>

        </tr>

    `;

});

    main.innerHTML = `

        <section class="card">

            <h2>📋 Histórico de Avaliações</h2>

            <div class="tabela-container">

                <table class="tabela-resultados">

                    <thead>

                        <tr>

<th>Data</th>
<th>Fazenda</th>
<th>Talhão</th>
<th>Equipe</th>
<th>Geral</th>
<th>Espaçamento</th>
<th>Profundidade</th>
<th>Inclinação</th>
<th>Torrão</th>
<th>Dano</th>
<th>Alinhamento</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${linhas}

                    </tbody>

                </table>

            </div>

            <button onclick="novaAvaliacao()">
                ➕ Nova avaliação
            </button>

        </section>

    `;
}


function novaAvaliacao() {

    location.reload();

}
function exportarExcel() {

    const historico =
        JSON.parse(localStorage.getItem("avaliacoes")) || [];

    if (historico.length === 0) {

        alert("Não há avaliações para exportar.");

        return;
    }

    // ==========================================
    // ABA 1 - PLANTAS
    // ==========================================

    let dadosPlantas = [];

    historico.forEach(function(avaliacao) {

        avaliacao.plantas.forEach(function(planta) {

            dadosPlantas.push({
    "ID da avaliação": avaliacao.id,
    "Data": avaliacao.data,
    "Empresa": avaliacao.empresa,
    "Município": avaliacao.municipio,
    "Fazenda": avaliacao.fazenda,
    "Talhão": avaliacao.talhao,
    "Equipe": avaliacao.equipe,
                "Latitude": avaliacao.latitude,
    "Longitude": avaliacao.longitude,
    "Precisão GPS (m)": avaliacao.precisaoGPS,

                "Planta": planta.numero,

                "Espaçamento": planta.respostas.espacamento,

                "Profundidade": planta.respostas.profundidade,

                "Inclinação": planta.respostas.inclinacao,

                "Torrão": planta.respostas.torrao,

                "Dano à planta": planta.respostas.dano,

                "Alinhamento": planta.respostas.alinhamento,

                "% Conformidade da planta":
                    planta.percentual,

                "% Conformidade do da avaliação":
                    avaliacao.percentualTotal

            });

        });

    });


    // ==========================================
    // ABA 2 - AVALIAÇÕES
    // ==========================================

    let dadosAvaliacoes = [];

    historico.forEach(function(avaliacao) {

        const parametros =
            avaliacao.conformidadeParametros || {};

        dadosAvaliacoes.push({
    "ID da avaliação": avaliacao.id,
    "Data": avaliacao.data,
    "Empresa": avaliacao.empresa,
    "Município": avaliacao.municipio,
    "Fazenda": avaliacao.fazenda,
    "Talhão": avaliacao.talhao,
    "Equipe": avaliacao.equipe,
    "Latitude": avaliacao.latitude,
    "Longitude": avaliacao.longitude,
    "Precisão GPS (m)": avaliacao.precisaoGPS,
            

            "% Conformidade geral":
                avaliacao.percentualTotal,

            "% Espaçamento":
                parametros.espacamento || 0,

            "% Profundidade":
                parametros.profundidade || 0,

            "% Inclinação":
                parametros.inclinacao || 0,

            "% Torrão":
                parametros.torrao || 0,

            "% Dano à planta":
                parametros.dano || 0,

            "% Alinhamento":
                parametros.alinhamento || 0

        });

    });


    // ==========================================
    // CRIAR PLANILHA
    // ==========================================

    const planilhaPlantas =
        XLSX.utils.json_to_sheet(dadosPlantas);

    const planilhaAvaliacoes =
        XLSX.utils.json_to_sheet(dadosAvaliacoes);


    // ==========================================
    // CRIAR ARQUIVO EXCEL
    // ==========================================

    const livro =
        XLSX.utils.book_new();


    // Adiciona a aba Plantas

    XLSX.utils.book_append_sheet(
        livro,
        planilhaPlantas,
        "Plantas"
    );


    // Adiciona a aba Avaliações

    XLSX.utils.book_append_sheet(
        livro,
        planilhaAvaliacoes,
        "Avaliações"
    );


    // ==========================================
    // BAIXAR ARQUIVO
    // ==========================================

    XLSX.writeFile(
        livro,
        "controle_qualidade_silvicultura.xlsx"
    );

}


function gerarIdAvaliacao() {

    const agora = new Date();

    const ano = agora.getFullYear();

    const mes = String(agora.getMonth() + 1).padStart(2, "0");

    const dia = String(agora.getDate()).padStart(2, "0");

    const dataHoje = `${ano}${mes}${dia}`;

    const historico =
        JSON.parse(localStorage.getItem("avaliacoes")) || [];

    const avaliacoesHoje = historico.filter(function(avaliacao) {

        if (!avaliacao.id) {
            return false;
        }

        const id = String(avaliacao.id);

        return id.startsWith(dataHoje + "-");

    });

    const numero =
        String(avaliacoesHoje.length + 1).padStart(3, "0");

    return `${dataHoje}-${numero}`;
}

function capturarGPS() {

    if (!navigator.geolocation) {
        alert("Este navegador não suporta localização GPS.");
        return;
    }

    const status = document.getElementById("statusGPS");

    status.textContent = "📡 Obtendo localização...";

    navigator.geolocation.getCurrentPosition(

        function(posicao) {

            const latitude = posicao.coords.latitude;
            const longitude = posicao.coords.longitude;
            const precisao = posicao.coords.accuracy;

            avaliacaoAtual.latitude = latitude;
            avaliacaoAtual.longitude = longitude;
            avaliacaoAtual.precisaoGPS = precisao;

          const mapa = L.map("mapa").setView([latitude, longitude], 18);

L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        attribution: "Tiles &copy; Esri"
    }
).addTo(mapa);

L.marker([latitude, longitude])
    .addTo(mapa)
    .bindPopup("📍 Ponto amostral")
    .openPopup();

setTimeout(function() {
    mapa.invalidateSize();
}, 300);

            document.getElementById("latitude").textContent =
                latitude.toFixed(6);

            document.getElementById("longitude").textContent =
                longitude.toFixed(6);

            document.getElementById("precisaoGPS").textContent =
                precisao.toFixed(1) + " m";

            status.textContent = "✅ Localização capturada";

        },

        function(erro) {

            status.textContent =
                "❌ Não foi possível obter a localização.";

            if (erro.code === 1) {
                alert("Permita o acesso à localização para utilizar o GPS.");
            } else if (erro.code === 2) {
                alert("Não foi possível determinar sua localização.");
            } else if (erro.code === 3) {
                alert("O GPS demorou muito para responder.");
            }

        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}