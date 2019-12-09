import AbstractComponent from './abstract-component';
import {formatDuration, getFileName} from './../utils/common';


const setControlClass = (control) => control ? `film-card__controls-item--active` : ``;


const createFilmCardTemplate = (film) => {
  const {
    title,
    rate,
    year,
    duration,
    genre,
    description,
    commentsCount,
    isInWatchlist,
    isWatched,
    isFavorite,
  } = film;

  const formattedDuration = formatDuration(duration);
  const fileName = getFileName(title);

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rate}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${formattedDuration}</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <img src="./images/posters/${fileName}.jpg" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${commentsCount} comments</a>
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${setControlClass(isInWatchlist)}">
        Add to watchlist
      </button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched  ${setControlClass(isWatched)}">
        Mark as watched
      </button>
      <button class="film-card__controls-item button film-card__controls-item--favorite  ${setControlClass(isFavorite)}">
        Mark as favorite
      </button>
    </form>
  </article>`;
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setFilmPosterClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, handler);
  }

  setFilmTitleClickHandler(handler) {
    this.getElement().querySelector(`.film-card__title`)
      .addEventListener(`click`, handler);
  }

  setFilmCommentsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__comments`)
      .addEventListener(`click`, handler);
  }
}
