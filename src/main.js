import UserRankComponent from './components/user-rank';
import MainNavigationComponent from './components/main-navigation';
import SortListComponent from './components/sort-list';
import FilmsComponent from './components/films';
import FilmDetailsComponent from './components/film-details';
import FilmsListComponent from './components/films-list';
import LoadMoreButtonComponent from './components/load-more-button';
import FilmsListExtraComponent from './components/films-list-extra';
import FilmCardComponent from './components/film-card';
import {generateFilms} from './mock/film';
import {RenderPosition, render} from './utils';


const FILM_COUNT = 15;
const SHOWING_FILM_CARD_COUNT_ON_START = 5;
const SHOWING_FILM_CARD_COUNT_BY_BUTTON = 5;
const SHOWING_FILM_CARD_COUNT_BY_EXTRA = 2;


const filmCards = generateFilms(FILM_COUNT);
const filmsListExtraTitles = [`Top rated`, `Most commented`];


const renderCardsAmount = (cards, sliceFrom, sliceTo, container) => {
  cards
    .slice(sliceFrom, sliceTo)
    .forEach((card) => render(container, new FilmCardComponent(card).getElement(), RenderPosition.BEFOREEND));
};


const filmsWatchList = filmCards.filter(({isInWatchlist}) => isInWatchlist);
const filmsWatched = filmCards.filter(({isWatched}) => isWatched);
const filmFavorite = filmCards.filter(({isFavorite}) => isFavorite);

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics p`);

footerStatisticsElement.textContent = `${filmCards.length} movies inside`;

render(headerElement, new UserRankComponent(filmsWatchList.length).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new MainNavigationComponent(filmsWatchList.length, filmsWatched.length, filmFavorite.length).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new SortListComponent().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new FilmsComponent().getElement(), RenderPosition.BEFOREEND);

render(mainElement, new FilmDetailsComponent(filmCards[0]).getElement(), RenderPosition.BEFOREEND);

const filmsElement = mainElement.querySelector(`.films`);

render(filmsElement, new FilmsListComponent().getElement(), RenderPosition.BEFOREEND);

const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmsListContainerElement = filmsElement.querySelector(`.films-list__container`);

let showingFilmCardsCount = SHOWING_FILM_CARD_COUNT_ON_START;

renderCardsAmount(filmCards, 0, showingFilmCardsCount, filmsListContainerElement);

render(filmsListElement, new LoadMoreButtonComponent().getElement(), RenderPosition.BEFOREEND);

const loadMoreButton = filmsListElement.querySelector(`.films-list__show-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevFilmCardsCount = showingFilmCardsCount;
  showingFilmCardsCount += SHOWING_FILM_CARD_COUNT_BY_BUTTON;

  renderCardsAmount(filmCards, prevFilmCardsCount, showingFilmCardsCount, filmsListContainerElement);

  if (showingFilmCardsCount >= filmCards.length) {
    loadMoreButton.remove();
  }
});


const rateSum = filmCards.reduce((acc, {rate}) => rate + acc, 0);
const commentsSum = filmCards.reduce((acc, {commentsCount}) => commentsCount + acc, 0);


if (rateSum > 0) {
  render(filmsElement, new FilmsListExtraComponent(filmsListExtraTitles[0]).getElement(), RenderPosition.BEFOREEND);

  const sortedFilmCardsByRate = filmCards.slice().sort((a, b) => {
    return b.rate - a.rate;
  });

  const topRatedContainerElements = document.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);

  renderCardsAmount(sortedFilmCardsByRate, 0, SHOWING_FILM_CARD_COUNT_BY_EXTRA, topRatedContainerElements);
}


if (commentsSum > 0) {
  render(filmsElement, new FilmsListExtraComponent(filmsListExtraTitles[1]).getElement(), RenderPosition.BEFOREEND);

  const sortedFilmCardsByCommentCount = filmCards.slice().sort((a, b) => {
    return b.commentsCount - a.commentsCount;
  });

  const mostCommentedContainerElements = document.querySelector(`.films-list--extra:last-child .films-list__container`);

  renderCardsAmount(sortedFilmCardsByCommentCount, 0, SHOWING_FILM_CARD_COUNT_BY_EXTRA, mostCommentedContainerElements);
}
