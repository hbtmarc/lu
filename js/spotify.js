// ATENÇÃO: É NECESSÁRIO CRIAR UM APP NO SPOTIFY DEVELOPER DASHBOARD
// E OBTER O SEU CLIENT ID.

const CLIENT_ID = 'acaf0dfdee394fb09f91ac732552a1ff'; // <-- SEU CLIENT ID AQUI
const SPOTIFY_TRACK_URI = 'spotify:track:5U28PY9MekLyCBYtLHGQpe';
let spotifyPlayer;
let deviceId;
let accessToken;

window.onSpotifyWebPlaybackSDKReady = () => {
    // A SDK está pronta, mas a inicialização do player depende do token
};

// Esta função será chamada pelo botão "Começar"
function playSpotifyTrack() {
    // Verifica se o Client ID foi inserido.
    if (CLIENT_ID === 'SEU_CLIENT_ID_DO_SPOTIFY_AQUI') {
        console.error("ERRO: O Client ID do Spotify não foi configurado em js/spotify.js. O site não funcionará corretamente.");
        alert("Configuração do desenvolvedor incompleta: Client ID do Spotify ausente.");
        return;
    }

    // O Redirect URI DEVE ser exatamente igual ao que está no seu Spotify Dashboard.
    // Para GitHub Pages, deve ser: https://hbtmarc.github.io/lu/
    const redirectUri = window.location.origin + window.location.pathname;
    
    // CORREÇÃO: Adicionado o scope 'user-modify-playback-state' para permitir o controle da reprodução.
    const scopes = [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-modify-playback-state'
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
    
    window.location.hash = ''; // Limpa o hash da URL para uma aparência mais limpa

    const storedToken = localStorage.getItem('spotify_access_token');

    if (hash.access_token) {
        accessToken = hash.access_token;
        localStorage.setItem('spotify_access_token', accessToken);
        initializePlayer();
    } else if (storedToken) {
        accessToken = storedToken;
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
    spotifyPlayer.addListener('initialization_error', ({ message }) => { console.error("Initialization Error:", message); });
    spotifyPlayer.addListener('authentication_error', ({ message }) => { 
        console.error("Authentication Error:", message);
        // Se o token expirar, limpa e tenta autenticar novamente
        localStorage.removeItem('spotify_access_token');
        playSpotifyTrack();
    });
    spotifyPlayer.addListener('account_error', ({ message }) => { console.error("Account Error:", message); });
    spotifyPlayer.addListener('playback_error', ({ message }) => { console.error("Playback Error:", message); });

    // Player pronto para tocar
    spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Player do Spotify pronto com o Device ID', device_id);
        deviceId = device_id;
        startPlayback();
    });

    // Conecta o player
    spotifyPlayer.connect().then(success => {
        if (success) {
            console.log('O Web Playback SDK conectou-se com sucesso ao Spotify!');
        }
    });
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
    }).then(response => {
        if (response.ok) {
            console.log("A reprodução foi iniciada com sucesso.");
        } else {
            console.error("Falha ao iniciar a reprodução. Status:", response.status);
            response.json().then(data => console.error("Detalhes do erro:", data));
        }
    }).catch(error => console.error("Erro de rede ao tentar iniciar a reprodução:", error));
}