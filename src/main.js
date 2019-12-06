import UserRankComponent from './components/user-rank';
import MainNavigationComponent from './components/main-navigation';
import SortListComponent from './components/sort-list';
import FilmsComponent from './components/films';
import FilmsListComponent from './components/films-list';
import FilmsListExtraComponent from './components/films-list-extra';
import FilmListTitleComponent from './components/film-list-title';
import FilmListContainerComponent from './components/film-list-container';
import LoadMoreButtonComponent from './components/load-more-button';
import FilmCardComponent from './components/film-card';
import FilmDetailsComponent from './components/film-details';
import {generateFilms} from './mock/film';
import {RenderPosition, render} from './utils';


const FILM_COUNT = 15;
const SHOWING_FILM_CARD_COUNT_ON_START = 5;
const SHOWING_FILM_CARD_COUNT_BY_BUTTON = 5;
const SHOWING_FILM_CARD_COUNT_BY_EXTRA = 2;


const renderFilm = (container, film) => {
  const FilmCard = new FilmCardComponent(film);
  const FilmDetails = new FilmDetailsComponent(film);

  const filmPosterElement = FilmCard.getElement().querySelector(`.film-card__poster`);
  const filmTitleElement = FilmCard.getElement().querySelector(`.film-card__title`);
  const filmTCommentsElement = FilmCard.getElement().querySelector(`.film-card__comments`);
  const closeDetailsButton = FilmDetails.getElement().querySelector(`.film-details__close-btn`);

  const onEscKeyDown = (evt) => {
    const escKey = evt.key === `Escape` || evt.key === `Esc`;

    if (escKey) {
      closeFilmDetails(evt);
    }
  };

  const openFilmDetails = (evt) => {
    evt.preventDefault();
    render(mainElement, FilmDetails.getElement(), RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const closeFilmDetails = (evt) => {
    evt.preventDefault();
    FilmDetails.getElement().remove();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  filmPosterElement.addEventListener(`click`, openFilmDetails);
  filmTitleElement.addEventListener(`click`, openFilmDetails);
  filmTCommentsElement.addEventListener(`click`, openFilmDetails);
  closeDetailsButton.addEventListener(`click`, closeFilmDetails);

  render(container, FilmCard.getElement(), RenderPosition.BEFOREEND);
};


const films = generateFilms(FILM_COUNT);
const filmsListExtraTitles = [`Top rated`, `Most commented`];

const filmsWatchList = films.filter(({isInWatchlist}) => isInWatchlist);
const filmsWatched = films.filter(({isWatched}) => isWatched);
const filmFavorite = films.filter(({isFavorite}) => isFavorite);

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics p`);

footerStatisticsElement.textContent = `${films.length} movies inside`;

render(headerElement, new UserRankComponent(filmsWatchList.length).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new MainNavigationComponent(filmsWatchList.length, filmsWatched.length, filmFavorite.length).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new SortListComponent().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new FilmsComponent().getElement(), RenderPosition.BEFOREEND);

const filmsElement = mainElement.querySelector(`.films`);

render(filmsElement, new FilmsListComponent().getElement(), RenderPosition.BEFOREEND);

const filmsListElement = filmsElement.querySelector(`.films-list`);

render(filmsListElement, new FilmListTitleComponent(films).getElement(), RenderPosition.BEFOREEND);


if (films.length) {
  render(filmsListElement, new FilmListContainerComponent().getElement(), RenderPosition.BEFOREEND);

  const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

  let showingFilmCardsCount = SHOWING_FILM_CARD_COUNT_ON_START;

  films
    .slice(0, showingFilmCardsCount)
    .forEach((card) => renderFilm(filmsListContainerElement, card));


  render(filmsListElement, new LoadMoreButtonComponent().getElement(), RenderPosition.BEFOREEND);

  const loadMoreButton = filmsListElement.querySelector(`.films-list__show-more`);

  loadMoreButton.addEventListener(`click`, () => {
    const prevFilmCardsCount = showingFilmCardsCount;
    showingFilmCardsCount += SHOWING_FILM_CARD_COUNT_BY_BUTTON;

    films
      .slice(prevFilmCardsCount, showingFilmCardsCount)
      .forEach((card) => renderFilm(filmsListContainerElement, card));

    if (showingFilmCardsCount >= films.length) {
      loadMoreButton.remove();
    }
  });


  const rateSum = films.reduce((acc, {rate}) => rate + acc, 0);
  const commentsSum = films.reduce((acc, {commentsCount}) => commentsCount + acc, 0);


  if (rateSum > 0) {
    render(filmsElement, new FilmsListExtraComponent(filmsListExtraTitles[0]).getElement(), RenderPosition.BEFOREEND);

    const sortedFilmCardsByRate = films
      .slice()
      .sort((a, b) => b.rate - a.rate);

    const topRatedContainerElements = document.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);

    sortedFilmCardsByRate
      .slice(0, SHOWING_FILM_CARD_COUNT_BY_EXTRA)
      .forEach((card) => renderFilm(topRatedContainerElements, card));
  }


  if (commentsSum > 0) {
    render(filmsElement, new FilmsListExtraComponent(filmsListExtraTitles[1]).getElement(), RenderPosition.BEFOREEND);

    const sortedFilmCardsByCommentCount = films
      .slice()
      .sort((a, b) => b.commentsCount - a.commentsCount);

    const mostCommentedContainerElements = document.querySelector(`.films-list--extra:last-child .films-list__container`);

    sortedFilmCardsByCommentCount
      .slice(0, SHOWING_FILM_CARD_COUNT_BY_EXTRA)
      .forEach((card) => renderFilm(mostCommentedContainerElements, card));
  }
}


