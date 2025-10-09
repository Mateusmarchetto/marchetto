/**
 * =========================================================================
 * FIGOS MARCHETTO - SCRIPT DE NAVEGAÇÃO E FUNCIONALIDADES
 * =========================================================================
 */

// URL da sua planilha publicada como CSV
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTIsyFMJc-V1ds5UJOoOOnF4ORdNMEPPJ0Ob7wLeRhATfK1QuM6xmyLs7EJ3t5OOtblSVJb7Det_GXY/pub?output=csv';

// Variável global para armazenar os dados da planilha e evitar múltiplos downloads
let dadosPlanilha = [];

/**
 * Busca e processa o arquivo CSV da planilha.
 * Armazena os dados em um formato fácil de usar.
 * @returns {Promise<void>}
 */
async function carregarDadosPlanilha() {
    // Se os dados já foram carregados, não faz nada.
    if (dadosPlanilha.length > 0) return;

    try {
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error('Falha ao carregar os dados da planilha.');
        
        const csvText = await response.text();
        
        // Processa o texto CSV
        const linhas = csvText.trim().split('\n');
        const cabecalho = linhas[0].split(',').map(h => h.trim());
        
        dadosPlanilha = linhas.slice(1).map(linha => {
            const valores = linha.split(',').map(v => v.trim().replace(/"/g, ''));
            let obj = {};
            cabecalho.forEach((key, i) => {
                obj[key] = valores[i] || ''; // Garante que todas as chaves existam
            });
            return obj;
        });

    } catch (error) {
        console.error("Erro ao carregar dados do CSV:", error);
        const mensagemEl = document.getElementById('mensagem-resultado');
        if (mensagemEl) {
            mensagemEl.textContent = 'Não foi possível carregar os dados. Tente novamente mais tarde.';
        }
    }
}

/**
 * Renderiza os resultados da busca em uma tabela HTML.
 * @param {Array} resultados - Os dados a serem exibidos.
 */
function renderizarResultados(resultados) {
    const tabelaContainer = document.getElementById('tabela-resultado');
    const mensagemContainer = document.getElementById('mensagem-resultado');

    if (!tabelaContainer || !mensagemContainer) return;

    tabelaContainer.innerHTML = '';
    mensagemContainer.textContent = '';

    if (resultados.length === 0) {
        mensagemContainer.textContent = 'Nenhum lote encontrado com este número.';
        return;
    }

    const tabela = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const headerRow = document.createElement('tr');

    // Cria o cabeçalho da tabela a partir das chaves do primeiro objeto
    Object.keys(resultados[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Cria as linhas da tabela com os dados
    resultados.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    tabela.appendChild(thead);
    tabela.appendChild(tbody);
    tabelaContainer.appendChild(tabela);
}

/**
 * Configura a funcionalidade de busca na página de rastreabilidade.
 */
async function setupBuscaLote() {
    const inputBusca = document.getElementById('input-busca-lote');
    const btnBusca = document.getElementById('btn-busca-lote');
    const btnLimpar = document.getElementById('btn-limpar-busca');

    if (!inputBusca) return; // Se não estamos na página de rastreabilidade, sai da função

    await carregarDadosPlanilha();
    renderizarResultados(dadosPlanilha); // Mostra todos os dados inicialmente

    const executarBusca = () => {
        const termoBusca = inputBusca.value.trim();
        if (!termoBusca) {
            renderizarResultados(dadosPlanilha);
            return;
        }

        // Busca precisa na primeira coluna (assumindo que a primeira chave é o lote)
        const primeiraColuna = Object.keys(dadosPlanilha[0])[0];
        const resultados = dadosPlanilha.filter(item => 
            item[primeiraColuna].toLowerCase() === termoBusca.toLowerCase()
        );
        renderizarResultados(resultados);
    };

    const limparBusca = () => {
        inputBusca.value = '';
        renderizarResultados(dadosPlanilha);
    };

    btnBusca.addEventListener('click', executarBusca);
    btnLimpar.addEventListener('click', limparBusca);
    
    inputBusca.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            executarBusca();
        }
    });
}

/**
 * Inicializa funcionalidades que dependem do conteúdo específico da página.
 */
function initializePageScripts() {
    const videoFundo = document.querySelector('.video-fundo');
    if (videoFundo) {
        videoFundo.play().catch(error => {});
        videoFundo.playbackRate = 1.3;
    }
    setupBuscaLote();
}

// ==========================================================================
// LÓGICA DE TRANSIÇÃO DE PÁGINA (SPA)
// ==========================================================================

const fetchPageAndUpdateDOM = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Falha na requisição: ${response.statusText}`);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        document.body.className = doc.body.className;
        document.getElementById('page-wrapper').innerHTML = doc.getElementById('page-wrapper').innerHTML;
        document.title = doc.title;

        initializePageScripts();

    } catch (error) {
        console.error('Erro ao carregar a página para transição:', error);
        window.location.href = url;
    }
};

const performTransition = (destinationUrl) => {
    if (!document.startViewTransition) {
        window.location.href = destinationUrl;
        return;
    }

    const currentPath = window.location.pathname.replace(/index\.html$/, '');
    const destinationPath = new URL(destinationUrl).pathname.replace(/index\.html$/, '');

    const isNavigatingToOrFromHome = 
        (currentPath === '/' && destinationPath !== '/') || 
        (currentPath !== '/' && destinationPath === '/');

    if (isNavigatingToOrFromHome) {
        document.documentElement.classList.add('slow-transition');
    }

    const transition = document.startViewTransition(() => fetchPageAndUpdateDOM(destinationUrl));

    transition.finished.finally(() => {
        document.documentElement.classList.remove('slow-transition');
    });
};

const handleLinkClick = (e) => {
    const link = e.target.closest('a');

    if (!link) return;

    if (link.getAttribute('href') === '#') {
        e.preventDefault();
        return;
    }

    if (link.classList.contains('link-interno')) {
        e.preventDefault();
        const destinationUrl = new URL(link.href);
        const currentUrl = new URL(window.location.href);
        const isLogoLink = link.classList.contains('logo-link');

        if (currentUrl.pathname === destinationUrl.pathname && !isLogoLink) {
            return;
        }

        performTransition(destinationUrl.href);
    }
};

document.addEventListener('click', handleLinkClick);
document.addEventListener('DOMContentLoaded', initializePageScripts);