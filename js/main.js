// js/main.js

import { initHeartAnimations } from './modules/animations.js';
import { initGallery } from './modules/gallery.js';
import { initTimelineCounters } from './modules/timeline.js';

/**
 * Função principal de inicialização da aplicação.
 */
function init() {
    // 1. Inicia todos os componentes visuais
    initHeartAnimations();
    initGallery();
    initTimelineCounters();

    // 2. Tenta tocar a música.
    // Nota: Isto pode ser bloqueado por políticas de autoplay do navegador.
    const backgroundMusic = document.getElementById('background-music');
    const playPromise = backgroundMusic.play();

    if (playPromise!== undefined) {
        playPromise.then(_ => {
            // Autoplay iniciado com sucesso.
            console.log("Música a tocar automaticamente!");
        }).catch(error => {
            // Autoplay foi bloqueado.
            console.warn("A reprodução automática da música foi bloqueada pelo navegador.");
            console.warn("É necessária uma interação do utilizador (clique) para iniciar o áudio.");
            // Adiciona um evento de clique para que a música toque na primeira interação do utilizador.
            document.body.addEventListener('click', () => {
                backgroundMusic.play();
            }, { once: true }); // O evento só será acionado uma vez.
        });
    }
}

// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);