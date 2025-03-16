const clientId = "89caf2856efd4e06b271ac1998cd56a1";
const clientSecret = "96a9682c84a8459184f41084844f54f7";
const redirectUri = "http://localhost:5173"; 
const authEndpoint = "https://accounts.spotify.com/authorize";

const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-modify-playback-state",
  "user-read-playback-position",
  "user-read-email",
  "user-library-modify",
  "playlist-modify-public",
  "ugc-image-upload",
  "user-follow-modify",
  "user-read-private",
  "user-library-read",
  "playlist-modify-private",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-follow-read"
];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=code&show_dialog=true`;

export const exchangeCodeForTokens = async (authorizationCode) => {
  const url = "https://accounts.spotify.com/api/token";

  const credentials = btoa(`${clientId}:${clientSecret}`);

  const payload = {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: authorizationCode,
      redirect_uri: redirectUri,
      client_id: clientId
    }),
  };

  const response = await fetch(url, payload);
  const data = await response.json();

  if (data.access_token) {
    const expirationTime = Date.now() + data.expires_in * 1000; // Calculamos la hora de expiración
    localStorage.setItem('spotify_access_token', data.access_token);
    localStorage.setItem('spotify_refresh_token', data.refresh_token);
    localStorage.setItem('spotify_token_expiration', expirationTime);
    return data;
  } else {
    console.error('Error al obtener tokens:', data);
    return null;
  }
};

export const getTokenFromURL = async () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const authorizationCode = params.get("code");

  if (authorizationCode) {
    // Llamamos a exchangeCodeForTokens para obtener el access_token y refresh_token
    const tokens = await exchangeCodeForTokens(authorizationCode);
    window.history.replaceState({}, document.title, window.location.pathname);
    return tokens;
  }
  return null;
};

export const checkLoginStatus = () => {
  const accessToken = localStorage.getItem("spotify_access_token");

  return accessToken
    ? { iniciar_sesion: true, token: accessToken }
    : { iniciar_sesion: false, token: null };
};

// Función para verificar si el access_token ha caducado
export const isAccessTokenExpired = () => {
  const expirationTime = localStorage.getItem('spotify_token_expiration');
  return expirationTime && Date.now() > expirationTime;
};

// Función para obtener el access_token y renovarlo si está caducado
export const getAccessToken = async () => {
  if (isAccessTokenExpired()) {
    console.log('El access_token ha caducado, renovando...');
    await getRefreshToken(); // Llamamos a getRefreshToken para renovar el token
  }

  return localStorage.getItem('spotify_access_token');
};

export const getRefreshToken = async () => {
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  const url = "https://accounts.spotify.com/api/token";

  if (!refreshToken) {
    console.error("No refresh token found.");
    return;
  }

  const credentials = btoa(`${clientId}:${clientSecret}`);

  const payload = {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId
    }),
  };

  const response = await fetch(url, payload);
  const data = await response.json();

  if (data.access_token) {
    localStorage.setItem('spotify_access_token', data.access_token);
    const expirationTime = Date.now() + data.expires_in * 1000; 
    localStorage.setItem('spotify_token_expiration', expirationTime);
  }

  if (data.refresh_token) {
    localStorage.setItem('spotify_refresh_token', data.refresh_token);
  }
};
