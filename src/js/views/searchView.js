import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

export const highlightSelected = (id) => {
  const resultsArr = Array.from(
    document.querySelectorAll(".results__link--active")
  );
  resultsArr.forEach((el) => {
    el.classList.remove("results__link--active");
  });
  const resultLink = document.querySelector(`.results__link[href="#${id}"]`);
  if (resultLink) {
    resultLink.classList.add("results__link--active");
  }
};

export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);

    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

const renderRecipe = (recipe) => {
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.id}">
        <figure class="results__fig">
          <img src="${recipe.image}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
        </div>
      </a>
    </li>`;
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

const renderButtons = (page, numResults, resultsPerPage) => {
  const pages = Math.ceil(numResults / resultsPerPage);
  let pageButtons;

  if (page === 1 && pages > 1) {
    pageButtons = createButton(page, "next");
  } else if (page < pages) {
    pageButtons = `${createButton(page, "prev")} ${createButton(page, "next")}`;
  } else if (page === pages && pages > 1) {
    pageButtons = createButton(page, "prev");
  } else {
    pageButtons = "";
  }

  elements.searchResPages.insertAdjacentHTML("afterbegin", pageButtons);
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;

  recipes.slice(start, end).forEach(renderRecipe);
  renderButtons(page, recipes.length, resultsPerPage);
};

//type = 'prev' or 'next'
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" 
    data-goto="${type === "prev" ? page - 1 : page + 1}">

    <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${
          type === "prev" ? "left" : "right"
        }"></use>
    </svg>
  </button>`;
