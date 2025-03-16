import Button from "./Button";
import { loginUrl } from "./spotify_login";

function Navbar() {

  
  return(
    <Button url={loginUrl} altText="Iniciar sesion" />
  );
}

export default Navbar;
