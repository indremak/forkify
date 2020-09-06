import { elements } from "../views/base";
import Api from "../utils/api";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    this.result = await Api.search(this.query);
  }
}
