import Axios from "axios";

export default class Api {
  static getKey() {
    return "e2391113850c4cddb62b80514fb6030c";
  }

  static getBase() {
    return "https://api.spoonacular.com/recipes";
  }

  static async search(query) {
    const numberOfResults = 100;
    const res = await Axios(
      `${this.getBase()}/complexSearch?apiKey=${this.getKey()}&query=${query}&number=${numberOfResults}`
    );

    return res.data.results;
  }

  static async getRecipe(id) {
    const res = await Axios(
      `${this.getBase()}/${id}/information?apiKey=${this.getKey()}`
    );
    return res;
  }
}
