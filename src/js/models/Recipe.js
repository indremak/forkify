import axios from "axios";
import { elements } from "../views/base";
import Api from "../utils/api";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      this.result = await Api.getRecipe(this.id);

      this.title = this.result.data.title;
      this.author = this.result.data.sourceName;
      this.img = this.result.data.image;
      this.url = this.result.data.sourceUrl;
      this.servings = this.result.data.servings;
      this.ingredients = this.result.data.extendedIngredients.map((el) => ({
        count: el.measures.us.amount,
        unit: el.measures.us.unitShort.toLowerCase(),
        name: el.name,
      }));
      this.calcTime();
    } catch (error) {
      console.log(error);
      elements.recipe.innerHTML = "Something went wrong";
    }
  }

  calcTime() {
    // 15 min for each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  updateServings(type) {
    //servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;

    //ingredients
    this.ingredients.forEach((ing) => {
      ing.count *= newServings / this.servings;
    });

    this.servings = newServings;
  }
}
