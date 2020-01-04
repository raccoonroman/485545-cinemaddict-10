import API from './api';
import UserRankController from './controllers/user-rank';
import FilterController from './controllers/filter';
import SortComponent from './components/sort';
import FilmsComponent from './components/films';
import FilmsListComponent from './components/films-list';
import FilmListTitleComponent from './components/film-list-title';
import StatsComponent from './components/stats';
import MoviesModel from './models/movies';
import PageController from './controllers/page';
import {RenderPosition, render} from './utils/render';
import {statsPeriods} from './const';


const AUTHORIZATION = `Basic nginxkByYXNzd29yZAov`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics p`);

const filmsComponent = new FilmsComponent();
const sortComponent = new SortComponent();
const statsComponent = new StatsComponent(moviesModel, statsPeriods.ALL_TIME);

const userRankController = new UserRankController(headerElement, moviesModel);
const pageController = new PageController(filmsComponent, sortComponent, moviesModel);
const filterController = new FilterController(mainElement, moviesModel, pageController, sortComponent, statsComponent);


userRankController.render();
filterController.render();

render(mainElement, statsComponent, RenderPosition.BEFOREEND);
render(mainElement, sortComponent, RenderPosition.BEFOREEND);
render(mainElement, filmsComponent, RenderPosition.BEFOREEND);

const filmsElement = mainElement.querySelector(`.films`);

render(filmsElement, new FilmsListComponent(), RenderPosition.BEFOREEND);

const filmsListElement = filmsElement.querySelector(`.films-list`);

statsComponent.hide();

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);

    render(filmsListElement, new FilmListTitleComponent(movies), RenderPosition.BEFOREEND);

    pageController.render();
    pageController.renderTopRatedList();
    pageController.renderMostCommentedList();
    footerStatisticsElement.textContent = `${movies.length} movies inside`;
  });
