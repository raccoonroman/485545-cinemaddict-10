import {createElement} from '../utils.js';

const createFilmsListTitleTemplate = (films) => {
  return `<h2 class="films-list__title ${films.length ? `visually-hidden` : ``}">
    ${films.length ? `All movies. Upcoming` : `There are no movies in our database`}
  </h2>`;
};


export default class FilmsListTitle {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createFilmsListTitleTemplate(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
