import UserRankComponent from './components/user-rank';
import MainNavigationComponent from './components/main-navigation';
import SortListComponent from './components/sort-list';
import FilmsComponent from './components/films';
import FilmsListComponent from './components/films-list';
import FilmListTitleComponent from './components/film-list-title';
import MoviesModel from './models/movies';
import PageController from './controllers/page';
import {generateFilms} from './mock/film';
import {RenderPosition, render} from './utils/render';


const FILM_COUNT = 15;

const films = generateFilms(FILM_COUNT);
const moviesModel = new MoviesModel();
moviesModel.setMovies(films);

const filmsWatchList = films.filter(({isInWatchlist}) => isInWatchlist);
const filmsWatched = films.filter(({isWatched}) => isWatched);
const filmFavorite = films.filter(({isFavorite}) => isFavorite);

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics p`);

footerStatisticsElement.textContent = `${films.length} movies inside`;

const filmsComponent = new FilmsComponent();
const sortComponent = new SortListComponent();

render(headerElement, new UserRankComponent(filmsWatchList.length), RenderPosition.BEFOREEND);
render(mainElement, new MainNavigationComponent(filmsWatchList.length, filmsWatched.length, filmFavorite.length), RenderPosition.BEFOREEND);
render(mainElement, sortComponent, RenderPosition.BEFOREEND);
render(mainElement, filmsComponent, RenderPosition.BEFOREEND);


const filmsElement = mainElement.querySelector(`.films`);

render(filmsElement, new FilmsListComponent(), RenderPosition.BEFOREEND);

const filmsListElement = filmsElement.querySelector(`.films-list`);

render(filmsListElement, new FilmListTitleComponent(films), RenderPosition.BEFOREEND);

const pageController = new PageController(filmsComponent, sortComponent, moviesModel);

pageController.render();

