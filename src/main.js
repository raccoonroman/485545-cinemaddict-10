import API from './api';
import UserRankController from './controllers/user-rank';
import FilterController from './controllers/filter';
import SortComponent from './components/sort';
import FilmsComponent from './components/films';
import FilmsListComponent from './components/films-list';
import FilmListTitleController from './controllers/film-list-title';
import StatsController from './controllers/stats';
import MoviesModel from './models/movies';
import PageController from './controllers/page';
import {RenderPosition, render} from './utils/render';
import {statsPeriods} from './const';


const AUTHORIZATION = `Basic bNB3SQdNkD`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics p`);

const filmsComponent = new FilmsComponent();
const sortComponent = new SortComponent();

const userRankController = new UserRankController(headerElement, moviesModel);
const pageController = new PageController(filmsComponent, sortComponent, moviesModel, api);
const statsController = new StatsController(mainElement, moviesModel, statsPeriods.ALL_TIME);
const filterController = new FilterController(mainElement, moviesModel, pageController, sortComponent, statsController);

userRankController.render();
filterController.render();
statsController.render();
statsController.hide();

render(mainElement, sortComponent, RenderPosition.BEFOREEND);
render(mainElement, filmsComponent, RenderPosition.BEFOREEND);

const filmsElement = mainElement.querySelector(`.films`);

render(filmsElement, new FilmsListComponent(), RenderPosition.BEFOREEND);

const filmsListElement = filmsElement.querySelector(`.films-list`);

const filmListTitleController = new FilmListTitleController(filmsListElement, moviesModel);

filmListTitleController.render();


api.getMovies()
  .then((movies) => {

    const commentsPromises = movies.map((movie) => {
      return api.getComments(movie.id).then((comments) => {
        movie.comments = comments;
      });
    });

    // console.log(movies);

    Promise.all(commentsPromises).then(() => {
      moviesModel.setMovies(movies);

      pageController.render();
      pageController.renderTopRatedList();
      pageController.renderMostCommentedList();

      footerStatisticsElement.textContent = `${movies.length} movies inside`;
    });
  });
