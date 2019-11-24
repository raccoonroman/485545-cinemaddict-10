import {createUserRankTemplate} from './components/user-rank';
import {createMainNavigationTemplate} from './components/main-navigation';
import {createSortListTemplate} from './components/sort-list';
import {createFilmsTemplate} from './components/films';
import {createFilmDetailsTemplate} from './components/film-details';
import {createFilmsListTemplate} from './components/films-list';
import {createLoadMoreButtonTemplate} from './components/load-more-button';
import {createFilmsListExtraTemplate} from './components/films-list-extra';
import {createFilmCardTemplate} from './components/film-card';

const filmCardCount = 5;
const filmsListExtraTitles = [`Top rated`, `Most commented`];
const filmsInExtraCount = filmsListExtraTitles.length;


const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const multipleRender = (container, template, place = `beforeend`, quantity = 1) => {
  for (let i = 0; i < quantity; i++) {
    render(container, template, place);
  }
};

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

render(headerElement, createUserRankTemplate());
render(mainElement, createMainNavigationTemplate());
render(mainElement, createSortListTemplate());
render(mainElement, createFilmsTemplate());
render(mainElement, createFilmDetailsTemplate(), `afterend`);

const filmsElement = mainElement.querySelector(`.films`);
render(filmsElement, createFilmsListTemplate());

const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmsListContainerElement = filmsElement.querySelector(`.films-list__container`);

render(filmsListElement, createLoadMoreButtonTemplate());

filmsListExtraTitles.forEach((title) => render(filmsElement, createFilmsListExtraTemplate(title)));

const filmsListExtraContainerElements = document.querySelectorAll(`.films-list--extra .films-list__container`);

filmsListExtraContainerElements.forEach((filmsListExtraContainerElement) => {
  multipleRender(filmsListExtraContainerElement, createFilmCardTemplate(), `beforeend`, filmsInExtraCount);
});

multipleRender(filmsListContainerElement, createFilmCardTemplate(), `beforeend`, filmCardCount);
