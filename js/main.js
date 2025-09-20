// js/main.js

import { redirectToAuthCodeFlow, getAccessToken, initializePlayer, playTrack, resumePlayback, redirectUri } from './modules/spotify.js';
import { initHeartAnimations } from './modules/animations.js';
import { initGallery } from './modules/gallery.js';
import { initTimelineCounters } from './modules/timeline.js';

// --- Elementos do DOM ---
const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');
const loginButton = document.getElementById('login-button');
const authMessage = document.getElementById('auth-message');
const mobilePlayButtonContainer = document.getElementById('mobile-play-button-container');
const mobilePlayButton = document.getElementById('mobile-play-button');

/**
 * Função principal de inicialização da aplicação.
 */
async function init() {
    // 1. Inicia as animações de fundo imediatamente
    initHeartAnimations();

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    // Tenta obter o token do localStorage
    let accessToken = localStorage.getItem('spotify_access_token');

    if (code) {
        // 2. Se houver um código na URL, obtém um novo token
        try {
            accessToken = await getAccessToken(code);
            // Limpa a URL para remover o código, de forma robusta
            const path = new URL(redirectUri).pathname;
            window.history.pushState({}, null, path); 
        } catch (error) {
            console.error("Falha ao obter o token de acesso:", error);
            authMessage.textContent = "Ocorreu um erro. Por favor, tente novamente.";
            loginButton.style.display = 'inline-block';
            return;
        }
    }

    if (accessToken) {
        // 3. Se temos um token (novo ou antigo), inicializa o player
        loginButton.style.display = 'none';
        authMessage.textContent = "A conectar ao Spotify...";
        try {
            await initializePlayer(accessToken);
            const playbackStarted = await playTrack(accessToken);

            // Lida com a falha de autoplay em dispositivos móveis
            if (!playbackStarted) {
                mobilePlayButtonContainer.style.display = 'block';
                authMessage.style.display = 'none';
            } else {
                showMainContent();
            }
        } catch (error) {
            console.error("Erro ao inicializar o player:", error);
            // Se o erro for de autenticação, o token pode ter expirado.
            // O próprio módulo spotify.js já deve ter iniciado o redirecionamento.
            authMessage.textContent = "Sessão expirada. A redirecionar para o login...";
        }
    } else {
        // 4. Se não há token, mostra o botão de login
        // CORREÇÃO: Usar 'inline-block' para respeitar o text-align: center do pai.
        loginButton.style.display = 'inline-block';
    }
}

/**
 * Mostra o conteúdo principal e inicializa os componentes.
 */
function showMainContent() {
    loadingScreen.style.display = 'none';
    mainContent.style.display = 'block';

    // Inicializa a galeria e os contadores
    initGallery();
    initTimelineCounters();
}

// --- Event Listeners ---
loginButton.addEventListener('click', redirectToAuthCodeFlow);

mobilePlayButton.addEventListener('click', () => {
    resumePlayback();
    showMainContent();
});

// Inicia a aplicação
document.addEventListener('DOMContentLoaded', init);