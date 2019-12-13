import AbstractComponent from './abstract-component';
import {formatDuration, formatYear, getFileName} from './../utils/common';


const setControlClass = (control) => {
  return control ? `film-card__controls-item--active` : ``;
};

const createRatingText = (rating) => rating ? rating : `N/A`;


const createFilmCardTemplate = (film) => {
  const {
    title,
    rating,
    releaseDate,
    duration,
    genres,
    description,
    commentsCount,
    isInWatchlist,
    isWatched,
    isFavorite,
  } = film;

  const [mainGenre] = genres;

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${createRatingText(rating)}</p>
    <p class="film-card__info">
      <span class="film-card__year">${formatYear(releaseDate)}</span>
      <span class="film-card__duration">${formatDuration(duration)}</span>
      <span class="film-card__genre">${mainGenre}</span>
    </p>
    <img src="./images/posters/${getFileName(title)}.jpg" alt="" class="film-card__poster">
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
