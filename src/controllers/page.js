import FilmsListTopRatedComponent from './../components/film-list-top-rated';
import FilmsListMostCommentedComponent from './../components/film-list-most-commented';
import FilmListContainerComponent from './../components/film-list-container';
import LoadMoreButtonComponent from './../components/load-more-button';
import FilmCardComponent from './../components/film-card';
import FilmDetailsComponent from './../components/film-details';
import {RenderPosition, render, remove} from './../utils/render';
import {SortType} from './../components/sort-list';


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

const renderFilms = (cardContainer, detailsContainer, films) => films
  .forEach((film) => renderFilm(cardContainer, detailsContainer, film));


export default class PageController {
  constructor(filmsComponent, sortComponent) {
    this._filmsComponent = filmsComponent;
    this._sortComponent = sortComponent;
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

      const sortedFilmsByRating = this._filmsListTopRatedComponent.getSortedFilmsByRate(films);
      let showingFilmCardsCount = SHOWING_FILM_CARD_COUNT_ON_START;


      const renderLoadMoreButton = (Films) => {
        if (showingFilmCardsCount >= Films.length) {
          return;
        }

        render(filmsListElement, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

        this._loadMoreButtonComponent.setClickHandler(() => {
          const prevFilmCardsCount = showingFilmCardsCount;
          showingFilmCardsCount += SHOWING_FILM_CARD_COUNT_BY_BUTTON;

          renderFilms(filmsListContainerElement, filmsElement, Films.slice(prevFilmCardsCount, showingFilmCardsCount));

          if (showingFilmCardsCount >= Films.length) {
            remove(this._loadMoreButtonComponent);
          }
        });
      };


      render(filmsListElement, this._filmListContainerComponent, RenderPosition.BEFOREEND);
      renderFilms(filmsListContainerElement, filmsElement, films.slice(0, showingFilmCardsCount));
      renderLoadMoreButton(films);


      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        let sortedFilms = [];

        switch (sortType) {
          case SortType.DATE:
            sortedFilms = films.slice().sort((a, b) => b.year - a.year);
            break;
          case SortType.RATING:
            sortedFilms = sortedFilmsByRating;
            break;
          case SortType.DEFAULT:
            sortedFilms = films;
            break;
        }

        filmsListContainerElement.innerHTML = ``;
        showingFilmCardsCount = SHOWING_FILM_CARD_COUNT_ON_START;

        renderFilms(filmsListContainerElement, filmsElement, sortedFilms.slice(0, showingFilmCardsCount));
        remove(this._loadMoreButtonComponent);
        renderLoadMoreButton(sortedFilms);
      });


      if (this._filmsListTopRatedComponent.hasRates(films)) {
        render(filmsElement, this._filmsListTopRatedComponent, RenderPosition.BEFOREEND);

        const sortedFilms = sortedFilmsByRating;
        const topRatedContainerElements = filmsElement.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);

        renderFilms(topRatedContainerElements, filmsElement, sortedFilms.slice(0, SHOWING_FILM_CARD_COUNT_BY_EXTRA));
      }


      if (this._filmsListMostCommentedComponent.hasComments(films)) {
        render(filmsElement, this._filmsListMostCommentedComponent, RenderPosition.BEFOREEND);

        const sortedFilms = this._filmsListMostCommentedComponent.getSortedFilmsByCommentCount(films);
        const mostCommentedContainerElements = filmsElement.querySelector(`.films-list--extra:last-child .films-list__container`);

        renderFilms(mostCommentedContainerElements, filmsElement, sortedFilms.slice(0, SHOWING_FILM_CARD_COUNT_BY_EXTRA));
      }
    }
  }
}
