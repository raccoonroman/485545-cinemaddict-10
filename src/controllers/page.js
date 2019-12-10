import FilmsListTopRatedComponent from './../components/film-list-top-rated';
import FilmsListMostCommentedComponent from './../components/film-list-most-commented';
import FilmListContainerComponent from './../components/film-list-container';
import LoadMoreButtonComponent from './../components/load-more-button';
import FilmCardComponent from './../components/film-card';
import FilmDetailsComponent from './../components/film-details';
import {RenderPosition, render, remove} from './../utils/render';


const SHOWING_FILM_CARD_COUNT_ON_START = 5;
const SHOWING_FILM_CARD_COUNT_BY_BUTTON = 5;
const SHOWING_FILM_CARD_COUNT_BY_EXTRA = 2;


const renderFilm = (cardContainer, detailsContainer, film) => {
  const FilmCard = new FilmCardComponent(film);
  const FilmDetails = new FilmDetailsComponent(film);

  const onEscKeyDown = (evt) => {
    const escKey = evt.key === `Escape` || evt.key === `Esc`;

    if (escKey) {
      closeFilmDetails(evt);
    }
  };

  const openFilmDetails = (evt) => {
    evt.preventDefault();
    render(detailsContainer, FilmDetails, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const closeFilmDetails = (evt) => {
    evt.preventDefault();
    remove(FilmDetails);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  FilmCard.setFilmPosterClickHandler(openFilmDetails);
  FilmCard.setFilmTitleClickHandler(openFilmDetails);
  FilmCard.setFilmCommentsClickHandler(openFilmDetails);
  FilmDetails.setCloseDetailsButtonClickHandler(closeFilmDetails);

  render(cardContainer, FilmCard, RenderPosition.BEFOREEND);
};


export default class PageController {
  constructor(filmsComponent) {
    this._filmsComponent = filmsComponent;
    this._filmListContainerComponent = new FilmListContainerComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._filmsListTopRatedComponent = new FilmsListTopRatedComponent();
    this._filmsListMostCommentedComponent = new FilmsListMostCommentedComponent();
  }

  render(films) {
    if (films.length) {
      const filmsElement = this._filmsComponent.getElement();
      const filmsListElement = filmsElement.querySelector(`.films-list`);
      const filmsListContainerElement = this._filmListContainerComponent.getElement();

      render(filmsListElement, this._filmListContainerComponent, RenderPosition.BEFOREEND);

      let showingFilmCardsCount = SHOWING_FILM_CARD_COUNT_ON_START;

      films
        .slice(0, showingFilmCardsCount)
        .forEach((card) => renderFilm(filmsListContainerElement, filmsElement, card));

      render(filmsListElement, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const prevFilmCardsCount = showingFilmCardsCount;
        showingFilmCardsCount += SHOWING_FILM_CARD_COUNT_BY_BUTTON;

        films
          .slice(prevFilmCardsCount, showingFilmCardsCount)
          .forEach((card) => renderFilm(filmsListContainerElement, filmsElement, card));

        if (showingFilmCardsCount >= films.length) {
          remove(this._loadMoreButtonComponent);
        }
      });


      if (this._filmsListTopRatedComponent.hasRates(films)) {
        render(filmsElement, this._filmsListTopRatedComponent, RenderPosition.BEFOREEND);

        const sortedFilms = this._filmsListTopRatedComponent.getSortedFilmsByRate(films);
        const topRatedContainerElements = filmsElement.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);

        sortedFilms
          .slice(0, SHOWING_FILM_CARD_COUNT_BY_EXTRA)
          .forEach((card) => renderFilm(topRatedContainerElements, filmsElement, card));
      }


      if (this._filmsListMostCommentedComponent.hasComments(films)) {
        render(filmsElement, this._filmsListMostCommentedComponent, RenderPosition.BEFOREEND);

        const sortedFilms = this._filmsListMostCommentedComponent.getSortedFilmsByCommentCount(films);
        const mostCommentedContainerElements = filmsElement.querySelector(`.films-list--extra:last-child .films-list__container`);

        sortedFilms
          .slice(0, SHOWING_FILM_CARD_COUNT_BY_EXTRA)
          .forEach((card) => renderFilm(mostCommentedContainerElements, filmsElement, card));
      }
    }
  }
}
