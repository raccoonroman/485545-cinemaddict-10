import FilmsListTopRatedComponent from './../components/film-list-top-rated';
import FilmsListMostCommentedComponent from './../components/film-list-most-commented';
import FilmListContainerComponent from './../components/film-list-container';
import LoadMoreButtonComponent from './../components/load-more-button';
import {RenderPosition, render, remove} from './../utils/render';
import {SortType} from './../components/sort-list';
import MovieController from './movie';


const SHOWING_FILM_CARD_COUNT_ON_START = 5;
const SHOWING_FILM_CARD_COUNT_BY_BUTTON = 5;
const SHOWING_FILM_CARD_COUNT_BY_EXTRA = 2;


const renderFilms = (cardContainer, detailsContainer, films, onDataChange, onViewChange) => {
  return films.map((film) => {
    const filmController = new MovieController(cardContainer, detailsContainer, onDataChange, onViewChange);
    filmController.render(film);

    return filmController;
  });
};


export default class PageController {
  constructor(filmsComponent, sortComponent) {
    this._filmsComponent = filmsComponent;
    this._sortComponent = sortComponent;

    this._films = [];
    // this._showedFilmsControllers = []; пока закомментирую, так как считаю это лишним свойством. Если к следующей лекции это действительно станет не нужным, то удалю.
    this._allFilmsControllers = [];
    this._showingFilmCardCountByButton = SHOWING_FILM_CARD_COUNT_BY_BUTTON;

    this._filmListContainerComponent = new FilmListContainerComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._filmsListTopRatedComponent = new FilmsListTopRatedComponent();
    this._filmsListMostCommentedComponent = new FilmsListMostCommentedComponent();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(films) {
    this._films = films;

    if (films.length) {
      const filmsElement = this._filmsComponent.getElement();
      const filmsListElement = filmsElement.querySelector(`.films-list`);
      const filmsListContainerElement = this._filmListContainerComponent.getElement();

      render(filmsListElement, this._filmListContainerComponent, RenderPosition.BEFOREEND);

      const newFilms = renderFilms(filmsListContainerElement, filmsElement, this._films.slice(0, this._showingFilmCardCountByButton), this._onDataChange, this._onViewChange);
      // this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
      this._allFilmsControllers = this._allFilmsControllers.concat(newFilms);

      this._renderLoadMoreButton(this._films);


      if (this._filmsListTopRatedComponent.hasRates(this._films)) {

        render(filmsElement, this._filmsListTopRatedComponent, RenderPosition.BEFOREEND);

        const sortedFilms = this._filmsListTopRatedComponent.getSortedFilmsByRate(this._films);

        const topRatedContainerElements = filmsElement.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);

        const newFilmsInExtra = renderFilms(topRatedContainerElements, filmsElement, sortedFilms.slice(0, SHOWING_FILM_CARD_COUNT_BY_EXTRA), this._onDataChange, this._onViewChange);
        this._allFilmsControllers = this._allFilmsControllers.concat(newFilmsInExtra);
      }


      if (this._filmsListMostCommentedComponent.hasComments(this._films)) {

        render(filmsElement, this._filmsListMostCommentedComponent, RenderPosition.BEFOREEND);

        const sortedFilms = this._filmsListMostCommentedComponent.getSortedFilmsByCommentCount(this._films);

        const mostCommentedContainerElements = filmsElement.querySelector(`.films-list--extra:last-child .films-list__container`);

        const newFilmsInExtra = renderFilms(mostCommentedContainerElements, filmsElement, sortedFilms.slice(0, SHOWING_FILM_CARD_COUNT_BY_EXTRA), this._onDataChange, this._onViewChange);
        this._allFilmsControllers = this._allFilmsControllers.concat(newFilmsInExtra);
      }
    }
  }

  _renderLoadMoreButton(films) {
    if (this._showingFilmCardCountByButton >= films.length) {
      return;
    }

    const filmsElement = this._filmsComponent.getElement();
    const filmsListElement = filmsElement.querySelector(`.films-list`);
    const filmsListContainerElement = this._filmListContainerComponent.getElement();

    render(filmsListElement, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevFilmCardsCount = this._showingFilmCardCountByButton;
      this._showingFilmCardCountByButton += SHOWING_FILM_CARD_COUNT_BY_BUTTON;

      const newFilms = renderFilms(filmsListContainerElement, filmsElement, films.slice(prevFilmCardsCount, this._showingFilmCardCountByButton), this._onDataChange, this._onViewChange);
      // this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
      this._allFilmsControllers = this._allFilmsControllers.concat(newFilms);

      if (this._showingFilmCardCountByButton >= films.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    movieController.render(this._films[index]);
  }

  _onViewChange() {
    this._allFilmsControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedFilms = [];

    switch (sortType) {
      case SortType.DATE:
        sortedFilms = this._films.slice().sort((a, b) => {
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        });
        break;
      case SortType.RATING:
        sortedFilms = this._films.slice().sort((a, b) => b.rating - a.rating);
        break;
      case SortType.DEFAULT:
        sortedFilms = this._films.slice(0, this._showingFilmCardCountByButton);
        break;
    }

    const filmsElement = this._filmsComponent.getElement();
    const filmsListContainerElement = this._filmListContainerComponent.getElement();

    filmsListContainerElement.innerHTML = ``;
    this._showingFilmCardCountByButton = SHOWING_FILM_CARD_COUNT_ON_START;

    const newFilms = renderFilms(filmsListContainerElement, filmsElement, sortedFilms.slice(0, this._showingFilmCardCountByButton), this._onDataChange, this._onViewChange);
    // this._showedFilmsControllers = newFilms;
    this._allFilmsControllers = newFilms;
    remove(this._loadMoreButtonComponent);
    this._renderLoadMoreButton(sortedFilms);
  }
}
