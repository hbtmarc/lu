// js/main.js

import { initHeartAnimations } from './modules/animations.js';
import { initGallery } from './modules/gallery.js';
import { initTimelineCounters } from './modules/timeline.js';

// --- Elementos do DOM ---
const startScreen = document.getElementById('start-screen');
const mainContent = document.getElementById('main-content');
const playMusicButton = document.getElementById('play-music-button');
const backgroundMusic = document.getElementById('background-music');

/**
 * Função principal de inicialização da aplicação.
 */
function init() {
    // 1. Inicia as animações de fundo imediatamente
    initHeartAnimations();

    // 2. Adiciona o evento de clique ao botão para iniciar a música e mostrar o conteúdo
    playMusicButton.addEventListener('click', () => {
        // Tenta tocar a música
        backgroundMusic.play().then(() => {
            console.log("Música a tocar!");
        }).catch(error => {
            console.error("Erro ao tocar a música:", error);
        });

        // Esconde o ecrã inicial e mostra o conteúdo principal
        startScreen.style.display = 'none';
        showMainContent();
    });
}

/**
 * Mostra o conteúdo principal e inicializa os componentes visuais.
 */
function showMainContent() {
    mainContent.style.display = 'block';

    // Inicializa a galeria e os contadores
    initGallery();
    initTimelineCounters();
}

// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);