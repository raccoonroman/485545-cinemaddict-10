import UserRankComponent from './components/user-rank';
import FilterController from './controllers/filter';
import SortComponent from './components/sort';
import FilmsComponent from './components/films';
import FilmsListComponent from './components/films-list';
import FilmListTitleComponent from './components/film-list-title';
import MoviesModel from './models/movies';
import PageController from './controllers/page';
import {generateFilms} from './mock/film';
import {RenderPosition, render} from './utils/render';
import {getFilmsByFilter} from './utils/filter';
import {FilterType} from './const';


const FILM_COUNT = 15;

const films = generateFilms(FILM_COUNT);
const moviesModel = new MoviesModel();
moviesModel.setMovies(films);


const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics p`);

footerStatisticsElement.textContent = `${films.length} movies inside`;

const filmsComponent = new FilmsComponent();
const sortComponent = new SortComponent();
const filterController = new FilterController(mainElement, moviesModel);
filterController.render();

const watchedFilms = getFilmsByFilter(films, FilterType.HISTORY); // временное решение, пока не придумал, как автоматически обновлять звание пользователя

render(headerElement, new UserRankComponent(watchedFilms.length), RenderPosition.BEFOREEND);
render(mainElement, sortComponent, RenderPosition.BEFOREEND);
render(mainElement, filmsComponent, RenderPosition.BEFOREEND);


const filmsElement = mainElement.querySelector(`.films`);

render(filmsElement, new FilmsListComponent(), RenderPosition.BEFOREEND);

const filmsListElement = filmsElement.querySelector(`.films-list`);

render(filmsListElement, new FilmListTitleComponent(films), RenderPosition.BEFOREEND);

const pageController = new PageController(filmsComponent, sortComponent, moviesModel);

pageController.render();

