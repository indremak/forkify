import uniqid from "uniqid";

export default class List {
  constructor() {
    this.items = [];
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient,
    };

    this.items.push(item);
    this.persistData();
    return item;
  }

  deleteItem(id) {
    const index = this.items.findIndex((el) => el.id === id);
    this.items.splice(index, 1);
    this.persistData();
  }

  deleteAll() {
    this.items = [];
    this.persistData();
  }

  updateCount(id, newCount) {
    this.items.find((el) => el.id === id).count = newCount;
  }

  persistData() {
    localStorage.setItem("list", JSON.stringify(this.items));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem("list"));
    if (storage) {
      this.items = storage;
    }
  }
}
