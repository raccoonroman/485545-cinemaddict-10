import {createUserRankTemplate} from './components/user-rank';
import {createMainNavigationTemplate} from './components/main-navigation';
import {createSortListTemplate} from './components/sort-list';
import {createFilmsTemplate} from './components/films';
import {createFilmDetailsTemplate} from './components/film-details';
import {createFilmsListTemplate} from './components/films-list';
import {createLoadMoreButtonTemplate} from './components/load-more-button';
import {createFilmsListExtraTemplate} from './components/films-list-extra';
import {createFilmCardTemplate} from './components/film-card';
import {generateFilmCards} from './mock/film-card';


const FILM_CARD_COUNT = 15;
const SHOWING_FILM_CARD_COUNT_ON_START = 5;
const SHOWING_FILM_CARD_COUNT_BY_BUTTON = 5;
const SHOWING_FILM_CARD_COUNT_BY_EXTRA = 2;

const filmCards = generateFilmCards(FILM_CARD_COUNT);
const filmsListExtraTitles = [`Top rated`, `Most commented`];


const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const renderCardsAmount = (cards, sliceFrom, sliceTo, container) => {
  cards
    .slice(sliceFrom, sliceTo)
    .forEach((card) => render(container, createFilmCardTemplate(card)));
};


const filmsWatchList = filmCards.filter(({isInWatchlist}) => isInWatchlist);
const filmsWatched = filmCards.filter(({isWatched}) => isWatched);
const filmFavorite = filmCards.filter(({isFavorite}) => isFavorite);

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics p`);

footerStatisticsElement.textContent = `${filmCards.length} movies inside`;

render(headerElement, createUserRankTemplate(filmsWatchList.length));
render(mainElement, createMainNavigationTemplate(filmsWatchList.length, filmsWatched.length, filmFavorite.length));
render(mainElement, createSortListTemplate());
render(mainElement, createFilmsTemplate());
render(mainElement, createFilmDetailsTemplate(filmCards[0]), `afterend`);

const filmsElement = mainElement.querySelector(`.films`);

render(filmsElement, createFilmsListTemplate());

const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmsListContainerElement = filmsElement.querySelector(`.films-list__container`);

let showingFilmCardsCount = SHOWING_FILM_CARD_COUNT_ON_START;

renderCardsAmount(filmCards, 0, showingFilmCardsCount, filmsListContainerElement);

render(filmsListElement, createLoadMoreButtonTemplate());

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
  render(filmsElement, createFilmsListExtraTemplate(filmsListExtraTitles[0]));

  const sortedFilmCardsByRate = filmCards.slice().sort((a, b) => {
    return b.rate - a.rate;
  });

  const topRatedContainerElements = document.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);

  renderCardsAmount(sortedFilmCardsByRate, 0, SHOWING_FILM_CARD_COUNT_BY_EXTRA, topRatedContainerElements);
}


if (commentsSum > 0) {
  render(filmsElement, createFilmsListExtraTemplate(filmsListExtraTitles[1]));

  const sortedFilmCardsByCommentCount = filmCards.slice().sort((a, b) => {
    return b.commentsCount - a.commentsCount;
  });

  const mostCommentedContainerElements = document.querySelector(`.films-list--extra:last-child .films-list__container`);

  renderCardsAmount(sortedFilmCardsByCommentCount, 0, SHOWING_FILM_CARD_COUNT_BY_EXTRA, mostCommentedContainerElements);
}
