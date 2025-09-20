// ATENÇÃO: É NECESSÁRIO CRIAR UM APP NO SPOTIFY DEVELOPER DASHBOARD
// E OBTER O SEU CLIENT ID.

const CLIENT_ID = 'acaf0dfdee394fb09f91ac732552a1ff'; // <-- SUBSTITUA AQUI
const SPOTIFY_TRACK_URI = 'spotify:track:5U28PY9MekLyCBYtLHGQpe';
let spotifyPlayer;
let deviceId;
let accessToken;

window.onSpotifyWebPlaybackSDKReady = () => {
    // A SDK está pronta, mas a inicialização do player depende do token
};

// Esta função será chamada pelo botão "Começar"
function playSpotifyTrack() {
    // Para um projeto simples e pessoal, podemos usar um fluxo de autenticação implícito.
    // Ele redireciona o usuário para o Spotify para login e depois volta.
    // Para GitHub Pages, é crucial configurar a URL de redirecionamento no seu app Spotify.
    const redirectUri = window.location.origin + window.location.pathname;
    const scopes = [
        'streaming',
        'user-read-email',
        'user-read-private'
    ].join(' ');

    // Verifica se já temos um token na URL (após o redirecionamento)
    const hash = window.location.hash
       .substring(1)
       .split('&')
       .reduce(function (initial, item) {
            if (item) {
                var parts = item.split('=');
                initial[parts] = decodeURIComponent(parts[1]);
            }
            return initial;
        }, {});
    
    window.location.hash = ''; // Limpa o hash da URL

    if (hash.access_token) {
        accessToken = hash.access_token;
        initializePlayer();
    } else {
        // Se não houver token, redireciona para o login do Spotify
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
        window.location = authUrl;
    }
}

function initializePlayer() {
    if (!accessToken) return;

    spotifyPlayer = new Spotify.Player({
        name: 'Para Luiza',
        getOAuthToken: cb => { cb(accessToken); }
    });

    // Tratamento de erros
    spotifyPlayer.addListener('initialization_error', ({ message }) => { console.error(message); });
    spotifyPlayer.addListener('authentication_error', ({ message }) => { console.error(message); });
    spotifyPlayer.addListener('account_error', ({ message }) => { console.error(message); });
    spotifyPlayer.addListener('playback_error', ({ message }) => { console.error(message); });

    // Player pronto para tocar
    spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Player do Spotify pronto com o Device ID', device_id);
        deviceId = device_id;
        startPlayback();
    });

    // Conecta o player
    spotifyPlayer.connect();
}

function startPlayback() {
    if (!deviceId ||!accessToken) return;

    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    });
}