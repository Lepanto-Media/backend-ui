import { jwtDecode } from "jwt-decode";
import { AUTH_TOKEN } from "../../global/constants";

export function checkUser() {
  const token = localStorage.getItem(AUTH_TOKEN);
  if (token) {
    const user = jwtDecode(token);
    if (user.exp < Date.now() / 1000) {
      localStorage.removeItem(AUTH_TOKEN);
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}
