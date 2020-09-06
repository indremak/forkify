import { elements, renderLoader, clearLoader } from "./views/base";

import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";

import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";

const state = {};

const handleSearch = async () => {
  //get query from view
  const query = searchView.getInput();

  if (query) {
    state.search = new Search(query);

    //prepare UI for results
    searchView.clearResults();
    searchView.clearInput();
    renderLoader(elements.searchRes);

    try {
      await state.search.getResults();
      searchView.renderResults(state.search.result);
    } catch (err) {
      console.log(err);
      elements.searchResList.innerHTML = "Something went wrong";
    } finally {
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSearch();
});

elements.searchResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

const handleRecipeChange = async () => {
  //get id from url
  const id = window.location.hash.replace("#", "");

  if (id) {
    //prepare UI for changes
    renderLoader(elements.recipe);
    recipeView.clearRecipe();

    //highlight selected search item
    if (state.search) {
      searchView.highlightSelected(id);
    }

    state.recipe = new Recipe(id);

    try {
      await state.recipe.getRecipe();

      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      console.log(err);
      elements.recipe.innerHTML = "Something went wrong";
    }
  }
};

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, handleRecipeChange)
);

window.addEventListener("load", handleSearch);

const handleShoppingListAdd = () => {
  if (!state.list) {
    state.list = new List();
  }

  //add each ingredient to list
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.name);
    listView.renderItem(item);
  });
};

//handle delete and update list item events
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    state.list.deleteItem(id);
    listView.deleteItem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

//delete all items from shopping list
elements.deleteAll.addEventListener("click", () => {
  if (state.list) {
    state.list.deleteAll();
    listView.deleteAll();
  }
});

const handleLike = () => {
  if (!state.likes) {
    state.likes = new Likes();
  }
  const currentId = state.recipe.id;

  if (!state.likes.isLiked(currentId)) {
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    likesView.setLikeBtn(true);
    likesView.renderLike(newLike);
  } else {
    state.likes.deleteLike(currentId);
    likesView.setLikeBtn(false);
    likesView.deleteLike(currentId);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//restore liked recipes and shopping list on page load
window.addEventListener("load", () => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  state.likes.likes.forEach((like) => likesView.renderLike(like));

  state.list = new List();
  state.list.readStorage();
  state.list.items.forEach((item) => listView.renderItem(item));
});

//handling recipe button clicks
elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    handleShoppingListAdd();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    handleLike();
  }
});
