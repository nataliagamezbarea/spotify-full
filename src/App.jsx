import { useEffect } from "react";
import { checkLoginStatus } from "./spotify_login";
import Navbar from "./Navbar";

function App() {
  useEffect(() => {
    const checkStatus = async () => {
      const result = await checkLoginStatus();
      console.log(result);  // Aquí deberías ver el resultado del login
    };

    checkStatus();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <Navbar />
    </div>
  );
}

export default App;
