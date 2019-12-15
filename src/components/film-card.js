import AbstractComponent from './abstract-component';
import {formatDuration, formatYear, getFileName} from './../utils/common';


const createRatingText = (rating) => rating ? rating : `N/A`;

const createControlItemMarkup = (name, buttonText, isActive) =>
  `<button
    class="film-card__controls-item button
    film-card__controls-item--${name}
    ${isActive ? `film-card__controls-item--active` : ``}
  ">${buttonText}</button>`;


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
  const watchlistButton = createControlItemMarkup(`add-to-watchlist`, `Add to watchlist`, isInWatchlist);
  const watchedButton = createControlItemMarkup(`mark-as-watched`, `Mark as watched`, isWatched);
  const favoriteButton = createControlItemMarkup(`favorite`, `Mark as favorite`, isFavorite);

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${createRatingText(rating)}</p>
    <p class="film-card__info">
      <span class="film-card__year">${formatYear(releaseDate)}</span>
      <span class="film-card__duration">${formatDuration(duration)}</span>
      <span class="film-card__genre">${mainGenre}</span>
    </p>
    <img src="./images/posters/${getFileName(title)}.jpg" alt="${title}" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${commentsCount} comments</a>
    <form class="film-card__controls">
      ${watchlistButton}
      ${watchedButton}
      ${favoriteButton}
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

  setWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}
