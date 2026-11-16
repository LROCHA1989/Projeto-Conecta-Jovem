/* =====================================================================
   ARQUIVO: js/script.js
   PROJETO: Conecta Jovem
   FUNÇÃO: Controla as interações do site: preenche o ano no rodapé,
           abre/fecha o menu no celular, faz rolagem suave, mostra
           o botão "voltar ao topo", valida o formulário de newsletter
           e filtra a lista de oportunidades.
   ===================================================================== */


/* ---------------------------------------------------------------------
   BLOCO 1 — ANO AUTOMÁTICO NO RODAPÉ
   Busca o elemento <span id="ano"> e insere o ano atual.
   Evita ter que atualizar o copyright manualmente todo ano.
   --------------------------------------------------------------------- */
const ano = document.querySelector('#ano');
if (ano) {
    // new Date().getFullYear() devolve o ano em 4 dígitos (ex.: 2025)
    ano.textContent = new Date().getFullYear();
}


/* ---------------------------------------------------------------------
   BLOCO 2 — MENU HAMBURGUER (MOBILE)
   Quando o usuário clica no botão ☰, a classe "aberto" é adicionada
   ou removida do menu. O ícone também muda entre ☰ e ✕.
   O atributo aria-expanded informa ao leitor de tela se está aberto.
   --------------------------------------------------------------------- */
const menuToggle = document.querySelector('.menu-toggle');
const menu       = document.querySelector('#menu');

if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
        // toggle devolve true se a classe foi adicionada, false se removida
        const aberto = menu.classList.toggle('aberto');

        // Atualiza acessibilidade e ícone do botão
        menuToggle.setAttribute('aria-expanded', aberto);
        menuToggle.textContent = aberto ? '✕' : '☰';
    });

    // Fecha o menu ao clicar em qualquer link (comum em mobile)
    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            menu.classList.remove('aberto');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.textContent = '☰';
        });
    });
}


/* ---------------------------------------------------------------------
   BLOCO 3 — ROLAGEM SUAVE PARA LINKS INTERNOS
   Links que apontam para uma âncora (href="#id") são interceptados
   para rolar suavemente até a seção, em vez de saltar direto.
   --------------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (evento) => {
        const id = link.getAttribute('href');

        // Ignora links vazios (href="#") ou inválidos
        if (id === '#' || id.length < 2) return;

        const alvo = document.querySelector(id);
        if (alvo) {
            evento.preventDefault();     // impede o salto brusco padrão
            alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


/* ---------------------------------------------------------------------
   BLOCO 4 — BOTÃO "VOLTAR AO TOPO"
   Aparece quando o usuário rola mais de 300px. Ao clicar, volta
   ao topo da página com animação suave.
   --------------------------------------------------------------------- */
const btnTopo = document.querySelector('#voltar-topo');

if (btnTopo) {
    // Alterna a classe "visivel" de acordo com a posição do scroll
    window.addEventListener('scroll', () => {
        btnTopo.classList.toggle('visivel', window.scrollY > 300);
    });

    // Ao clicar, rola suavemente até o topo
    btnTopo.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* ---------------------------------------------------------------------
   BLOCO 5 — VALIDAÇÃO DO FORMULÁRIO DE NEWSLETTER
   Impede o envio padrão (que recarregaria a página), valida o
   formato do e-mail usando expressão regular e exibe uma
   mensagem de erro ou sucesso no parágrafo .mensagem.
   --------------------------------------------------------------------- */
const formNewsletter = document.querySelector('#form-newsletter');

if (formNewsletter) {
    formNewsletter.addEventListener('submit', (evento) => {
        evento.preventDefault();    // impede o envio real (não há back-end ainda)

        // Captura o valor digitado e remove espaços nas pontas
        const email    = formNewsletter.querySelector('#email').value.trim();
        const mensagem = formNewsletter.querySelector('.mensagem');

        // Expressão regular simples: algo@algo.algo
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Se o e-mail NÃO casar com o formato, mostra erro
        if (!regexEmail.test(email)) {
            mensagem.textContent = '⚠️ Por favor, informe um e-mail válido.';
            mensagem.className   = 'mensagem erro';
            return;             // encerra a função e não mostra o sucesso
        }

        // Se passou na validação, mostra sucesso e limpa o formulário
        mensagem.textContent = '✅ Inscrição realizada com sucesso! Em breve você receberá novidades.';
        mensagem.className   = 'mensagem sucesso';
        formNewsletter.reset();
    });
}


/* ---------------------------------------------------------------------
   BLOCO 6 — BUSCA / FILTRO NA LISTA DE OPORTUNIDADES
   Este bloco só roda em páginas que têm o campo #busca
   (ou seja, em oportunidades.html). Conforme o usuário digita,
   os <li> que NÃO contêm o termo digitado são escondidos.
   --------------------------------------------------------------------- */
const busca = document.querySelector('#busca');

if (busca) {
    // Seleciona todos os itens da lista de oportunidades
    const itens = document.querySelectorAll('#lista-oportunidades li');

    busca.addEventListener('input', () => {
        // Converte o termo digitado para minúsculas (busca case-insensitive)
        const termo = busca.value.toLowerCase().trim();

        itens.forEach((li) => {
            // Verifica se o texto do item contém o termo digitado
            const contem = li.textContent.toLowerCase().includes(termo);

            // "" (vazio) mostra o item; "none" esconde
            li.style.display = contem ? '' : 'none';
        });
    });
}

/* =========================================
   FUNCIONALIDADE DO VÍDEO (MODAL YOUTUBE)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const btnAbrir = document.getElementById('abrir-video');
    const modal = document.getElementById('modal-video');
    const btnFechar = document.getElementById('fechar-video');
    const iframe = document.getElementById('video-youtube');

    // O link convertido para formato "embed" para tocar dentro do site
    // O "autoplay=1" faz o vídeo tocar sozinho ao abrir
    const videoURL = "https://www.youtube.com/embed/naUTmMmS6gk?start=01&autoplay=1";

    if (btnAbrir && modal) {
        // Abrir o vídeo
        btnAbrir.addEventListener('click', (e) => {
            e.preventDefault(); // Impede a página de subir para o topo
            iframe.src = videoURL; // Coloca o link no iframe
            modal.classList.add('ativo'); // Mostra o modal
        });

        // Função para fechar o vídeo
        const fecharModal = () => {
            modal.classList.remove('ativo'); // Esconde o modal
            iframe.src = ""; // Limpa o link, fazendo o vídeo parar de tocar
        };

        // Fechar no botão X
        btnFechar.addEventListener('click', fecharModal);

        // Fechar ao clicar no fundo escuro (fora do vídeo)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                fecharModal();
            }
        });

        // Fechar ao apertar a tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('ativo')) {
                fecharModal();
            }
        });
    }
});
