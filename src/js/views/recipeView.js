import { elements } from "./base";
import { Fraction } from "fractional";

export const clearRecipe = () => {
  elements.recipe.innerHTML = "";
};

const formatCount = (count) => {
  if (count) {
    // Leaves 2 decimal places
    const newCount = Math.round(count * 100) / 100;
    const integerPart = Math.floor(newCount);
    const decimalPart = Math.round((newCount - integerPart) * 100);
    if (decimalPart === 0) {
      return newCount;
    }

    if (integerPart === 0) {
      const fraction = new Fraction(newCount);
      return `${fraction.numerator}/${fraction.denominator}`;
    } else {
      const fraction = new Fraction(newCount - integerPart);
      return `${integerPart} ${fraction.numerator}/${fraction.denominator}`;
    }
  }
  return "?";
};

export const renderRecipe = (recipe, isLiked) => {
  const markup = `
  ${getRecipeDetails(recipe, isLiked)}
  ${getRecipeIngredients(recipe)}
  ${getRecipeDirections(recipe)}`;
  elements.recipe.insertAdjacentHTML("afterbegin", markup);
};

export const updateServingsIngredients = (recipe) => {
  document.querySelector(".recipe__info-data--people").textContent =
    recipe.servings;

  const countElements = Array.from(document.querySelectorAll(".recipe__count"));
  countElements.forEach((el, i) => {
    el.textContent = formatCount(recipe.ingredients[i].count);
  });
};

const getRecipeDetails = (recipe, isLiked) => {
  return `
  <figure class="recipe__fig">
    <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
      <h1 class="recipe__title">
        <span>${recipe.title}</span>
      </h1>
  </figure>
  <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon"><use href="img/icons.svg#icon-stopwatch"></use></svg>
      <span class="recipe__info-data recipe__info-data--minutes">${
        recipe.time
      }</span>
      <span class="recipe__info-text"> minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon"><use href="img/icons.svg#icon-man"></use></svg>
      <span class="recipe__info-data recipe__info-data--people">${
        recipe.servings
      }</span>
      <span class="recipe__info-text"> servings</span>
      <div class="recipe__info-buttons">
        <button class="btn-tiny btn-decrease">
          <svg><use href="img/icons.svg#icon-circle-with-minus"></use></svg>
        </button>
        <button class="btn-tiny btn-increase">
          <svg><use href="img/icons.svg#icon-circle-with-plus"></use></svg>
        </button>
      </div>
    </div>
    <button class="recipe__love" aria-label="favorite">
      <svg class="header__likes"><use href="img/icons.svg#icon-heart${
        isLiked ? "" : "-outlined"
      }"></use></svg>
    </button>
  </div>`;
};

const getRecipeIngredients = (recipe) => {
  return `<div class="recipe__ingredients">
    <ul class="recipe__ingredient-list">
      ${recipe.ingredients.map((el) => createIngredient(el)).join("")}
    </ul>

    <button class="btn-small recipe__btn recipe__btn--add">
      <svg class="search__icon">
        <use href="img/icons.svg#icon-shopping-cart"></use>
      </svg>
      <span>Add to shopping list</span>
    </button>
  </div>`;
};

const getRecipeDirections = (recipe) => {
  return `<div class="recipe__directions">
    <h2 class="heading-2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
        <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
    </p>
    <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
      <span>Directions</span>
        <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>
    </a>
  </div>`;
};

const createIngredient = (ingredient) => `
  <li class="recipe__item">
    <svg class="recipe__icon">
      <use href="img/icons.svg#icon-check"></use>
    </svg>
    <div class="recipe__count">${formatCount(ingredient.count)}</div>
    <div class="recipe__ingredient">
      <span class="recipe__unit">${ingredient.unit}</span>
      ${ingredient.name}
    </div>
  </li>`;
