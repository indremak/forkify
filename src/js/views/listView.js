import { elements } from "./base";

export const renderItem = (item) => {
  const markup = `
    <li class="shopping__item" data-itemid="${item.id}">
      <div class="shopping__count">
        <input type="number" min="0" value="${item.count}" step="${item.count}"  class="shopping__count-value">
        <p>${item.unit}</p>
      </div>
      <p class="shopping__description">${item.ingredient}</p>
      <button class="shopping__delete btn-tiny">
        <svg>
          <use href="img/icons.svg#icon-circle-with-cross"></use>
        </svg>
      </button>
    </li>
    `;
  elements.shopping.insertAdjacentHTML("beforeend", markup);
  renderDeleteBtn();
};

export const deleteItem = (id) => {
  const item = document.querySelector(`[data-itemid="${id}"]`);
  if (item) item.parentElement.removeChild(item);
  renderDeleteBtn();
};

export const deleteAll = () => {
  elements.shopping.innerHTML = "";
  renderDeleteBtn();
};

const renderDeleteBtn = () => {
  const hasShoppingItem = !!document.querySelector(".shopping__item");
  if (hasShoppingItem) {
    elements.deleteAll.classList.remove("shopping__delete-all--hidden");
  } else {
    elements.deleteAll.classList.add("shopping__delete-all--hidden");
  }
};
