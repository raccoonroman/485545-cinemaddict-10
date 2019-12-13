import AbstractComponent from './abstract-component';


const createFilmsListTopRatedTemplate = () =>
  `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container"></div>
  </section>`;


export default class FilmsListTopRated extends AbstractComponent {
  getTemplate() {
    return createFilmsListTopRatedTemplate();
  }

  hasRates(films) {
    const ratesSum = films.reduce((acc, {rating}) => rating + acc, 0);
    return ratesSum > 0;
  }

  getSortedFilmsByRate(films) {
    return films.slice().sort((a, b) => b.rating - a.rating);
  }
}
