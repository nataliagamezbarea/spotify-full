import { useEffect } from "react";
import { getTokenFromURL } from "./spotify_login";
import Navbar from "./Navbar";

function App() {
  useEffect(() => {
    getTokenFromURL(); 
  }, []); 

  return (
    <div className="flex items-center justify-center h-screen">
      <Navbar />
    </div>
  );
}

export default App;
