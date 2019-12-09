import AbstractComponent from './abstract-component';


const createFilmsListExtraTemplate = (filmsListTitle) =>
  `<section class="films-list--extra">
      <h2 class="films-list__title">${filmsListTitle}</h2>
      <div class="films-list__container"></div>
  </section>`;


export default class FilmsListExtra extends AbstractComponent {
  constructor(filmsListTitle) {
    super();
    this._filmsListTitle = filmsListTitle;
  }

  getTemplate() {
    return createFilmsListExtraTemplate(this._filmsListTitle);
  }
}
