import Cookies from "js-cookie";
// get, set, remove
export default class AuthStorage {
  name = "auth";
  option = { expires: 365 };

  setAuth(authKey) {
    /**
     * authKey (required)
     * return (:void)
     */
    Cookies.set(this.name, authKey, this.option);
  }

  deleteAuth() {
    Cookies.remove(this.name);
  }

  getAuth() {
    /**
     * return authKey or "undefined"
     */
    return Cookies.get(this.name);
  }
}
