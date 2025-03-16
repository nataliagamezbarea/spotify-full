export const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

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
  "user-follow-read",
  "playlist-read-private",
  "playlist-read-collaborative",
];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=code&show_dialog=true`;

export const getTokenFromURL = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const authorizationCode = urlParams.get('code');

  if (authorizationCode) {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: authorizationCode,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem('spotifyAccessToken', data.access_token);
    }
    if (data.refresh_token) {
      localStorage.setItem('spotifyRefreshToken', data.refresh_token);
    }

    window.location.href = redirectUri; 
  }
}

export const getTokenFromLocalStorage = () => {
  return localStorage.getItem('spotifyAccessToken');
}

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('spotifyRefreshToken');
  if (!refreshToken) {
    console.log('No refresh token found. User might be logged out.');

    window.location.href = loginUrl;
    return;
  }

  const url = 'https://accounts.spotify.com/api/token';
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
  });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${btoa(clientId + ':' + clientSecret)}`,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      console.log('Failed to refresh token');
      return;
    }

    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem('spotifyAccessToken', data.access_token);
    }

    if (data.refresh_token) {
      localStorage.setItem('spotifyRefreshToken', data.refresh_token);
    }

    console.log('Token refreshed successfully');
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
}

const refreshInterval = 60 * 60 * 1000; 
setInterval(refreshToken, refreshInterval);
