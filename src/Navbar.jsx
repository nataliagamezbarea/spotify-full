import React, { useState, useEffect } from "react";
import { loginUrl } from "./spotify_login";

function Navbar() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('spotifyAccessToken') !== null);

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('spotifyAccessToken');
    localStorage.removeItem('spotifyRefreshToken');
    setIsLoggedIn(false); 
    console.log("Tokens removed from localStorage");
    window.location.reload(); 
  };

  const handleLogin = () => {
    window.location.href = loginUrl;  
  };

  useEffect(() => {
    const token = localStorage.getItem('spotifyAccessToken');
    
    if (token) {
      console.log('Spotify Access Token:', token);
    } else {
      console.log('No Spotify Access Token found');
    }

    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav>
      {!isLoggedIn && (
        <button onClick={handleLogin}>Iniciar sesión</button>
      )}
      
      {isLoggedIn && (
        <button onClick={logout}>Cerrar sesión</button>
      )}
      
      <div>
        {isLoggedIn ? (
          <p>Estás logueado con Spotify</p>
        ) : (
          <p>No estás logueado</p>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
