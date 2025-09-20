// js/modules/spotify.js

// --- Configuração ---
// ###################################################################################
// # IMPORTANTE: O BOTÃO NÃO FUNCIONARÁ ATÉ QUE SUBSTITUA O VALOR ABAIXO.          #
// ###################################################################################
// Cole o seu Client ID do Spotify Developer Dashboard aqui.
const clientId = "acaf0dfdee394fb09f91ac732552a1ff"; 

const trackUri = "spotify:track:5U28PY9MekLyCBYtLHGQpe"; // URI da música "A Thousand Years"

// O Redirect URI deve corresponder exatamente ao que foi configurado no Dashboard do Spotify.
// Atualizado para o seu URL específico do GitHub Pages.
export const redirectUri = "https://hbtmarc.github.io/lu/";

let player = null;
let deviceId = null;

// --- Funções de Autenticação (PKCE Flow) ---

/**
 * Redireciona o utilizador para a página de autorização do Spotify.
 * Gera e armazena o code_verifier para uso posterior.
 */
export async function redirectToAuthCodeFlow() {
    if (clientId === "SEU_CLIENT_ID_AQUI") {
        alert("Erro: O Client ID do Spotify não foi configurado no ficheiro js/modules/spotify.js");
        return;
    }

    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", redirectUri);
    // Scopes necessários para streaming e controlo de reprodução
    params.append("scope", "streaming user-read-email user-read-private user-modify-playback-state");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/**
 * Troca o código de autorização por um token de acesso.
 * @param {string} code - O código de autorização da URL.
 */
export async function getAccessToken(code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectUri);
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
    });

    const { access_token } = await result.json();
    if (access_token) {
        localStorage.setItem("spotify_access_token", access_token);
    }
    return access_token;
}

// --- Funções do Web Playback SDK ---

/**
 * Inicializa o Spotify Web Playback SDK.
 * @param {string} token - O token de acesso.
 */
export function initializePlayer(token) {
    return new Promise((resolve, reject) => {
        // Carrega o script do SDK se ainda não estiver carregado
        if (!window.Spotify) {
            const script = document.createElement('script');
            script.src = 'https://sdk.scdn.co/spotify-player.js';
            script.async = true;
            document.body.appendChild(script);
        }

        window.onSpotifyWebPlaybackSDKReady = () => {
            player = new window.Spotify.Player({
                name: 'Presente para Luiza',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            // Evento quando o player está pronto
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                deviceId = device_id;
                resolve(deviceId);
            });

            // Evento para erros
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
                reject('Device not ready');
            });

            player.addListener('initialization_error', ({ message }) => { 
                console.error('Initialization Error:', message);
                reject(message);
            });
            player.addListener('authentication_error', ({ message }) => {
                console.error('Authentication Error:', message);
                // Token expirado ou inválido, força novo login
                localStorage.removeItem("spotify_access_token");
                redirectToAuthCodeFlow();
                reject(message);
            });
            player.addListener('account_error', ({ message }) => {
                console.error('Account Error:', message);
                reject(message);
            });

            player.connect();
        };
    });
}

/**
 * Toca uma música específica no dispositivo do player.
 * @param {string} token - O token de acesso.
 */
export async function playTrack(token) {
    if (!deviceId) {
        console.error("Device ID não está disponível.");
        return;
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [trackUri] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.status === 204) {
            console.log('Música a tocar!');
            return true;
        } else {
            // Em alguns navegadores (especialmente móveis), a reprodução automática pode falhar
            console.warn('A reprodução automática pode ter falhado. A interação do utilizador pode ser necessária.');
            const errorData = await response.json().catch(() => null);
            console.error('Erro ao tocar música:', errorData);
            return false;
        }
    } catch (error) {
        console.error('Erro na chamada da API de reprodução:', error);
        return false;
    }
}

/**
 * Tenta resumir a reprodução (útil para interação do utilizador em dispositivos móveis).
 */
export function resumePlayback() {
    if (player) {
        player.resume().then(() => {
            console.log('Reprodução resumida!');
        });
    }
}

// --- Funções Auxiliares para PKCE ---

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}