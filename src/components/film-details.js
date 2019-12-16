import AbstractSmartComponent from './abstract-smart-component';
import {
  formatDuration,
  formatDate,
  formatRelativeTime,
  getFileName,
  createRatingText,
} from './../utils/common';


const createGenresMarkup = (genres) => genres
  .map((genre) => `<span class="film-details__genre">${genre}</span>`)
  .join(`\n`);

const createControlItemMarkup = (name, labelText, isActive) => {
  return `<input
    type="checkbox"
    class="film-details__control-input visually-hidden"
    id="${name}"
    name="${name}"
    ${isActive ? `checked` : ``}>
  <label
    for="${name}"
    class="film-details__control-label film-details__control-label--${name}"
  >${labelText}</label>`;
};

const createRatingScoreMarkup = (userRating) => {
  const from = 1;
  const to = 9;
  const result = [];

  for (let i = from; i <= to; i++) {
    result.push(`<input
      type="radio"
      name="score"
      class="film-details__user-rating-input visually-hidden"
      value="${i}"
      id="rating-${i}"
      ${userRating === i ? `checked` : ``}
    >
    <label
      class="film-details__user-rating-label"
      for="rating-${i}"
    >${i}</label>`);
  }

  return result.join(`\n`);
};

const createCommentsListMarkup = (comments) => comments
  .map((comment) => {
    const {text, emotions, author, date} = comment;
    return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotions}.png" width="55" height="55" alt="emoji">
    </span>
    <div>
      <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${formatRelativeTime(date)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
  })
.join(`\n`);


const createGenresTitleText = (genres) => genres.length > 1 ? `Genres` : `Genre`;


const createFilmDetailsTemplate = (film, options = {}) => {
  const {
    title,
    rating,
    releaseDate,
    duration,
    genres,
    description,
    comments,
  } = film;

  const {
    userRating,
    isInWatchlist,
    isWatched,
    isFavorite,
  } = options;

  const fileName = getFileName(title);
  const watchlistItem = createControlItemMarkup(`watchlist`, `Add to watchlist`, isInWatchlist);
  const watchedItem = createControlItemMarkup(`watched`, `Already watched`, isWatched);
  const favoriteItem = createControlItemMarkup(`favorite`, `Add to favorites`, isFavorite);

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${fileName}.jpg" alt="">

            <p class="film-details__age">18+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${title}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${createRatingText(rating)}</p>
                ${userRating ? `<p class="film-details__user-rating">Your rate ${userRating}</p>` : ``}
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">Anthony Mann</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">Anne Wigton, Heinz Herald, Richard Weil</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">Erich von Stroheim, Mary Beth Hughes, Dan Duryea</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${formatDate(releaseDate)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${formatDuration(duration)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">USA</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${createGenresTitleText(genres)}</td>
                <td class="film-details__cell">${createGenresMarkup(genres)}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          ${watchlistItem}
          ${watchedItem}
          ${favoriteItem}
        </section>
      </div>

      ${isWatched ? `<div class="form-details__middle-container">
        <section class="film-details__user-rating-wrap">
          <div class="film-details__user-rating-controls">
            <button class="film-details__watched-reset" type="button">Undo</button>
          </div>

          <div class="film-details__user-score">
            <div class="film-details__user-rating-poster">
              <img src="./images/posters/${fileName}.jpg" alt="film-poster" class="film-details__user-rating-img">
            </div>

            <section class="film-details__user-rating-inner">
              <h3 class="film-details__user-rating-title">${title}</h3>

              <p class="film-details__user-rating-feelings">How you feel it?</p>

              <div class="film-details__user-rating-score">
                ${createRatingScoreMarkup(userRating)}
              </div>
            </section>
          </div>
        </section>
      </div>` : ``}

      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${createCommentsListMarkup(comments)}
          </ul>

          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
              <label class="film-details__emoji-label" for="emoji-gpuke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
    this._userRating = film.userRating;
    this._isInWatchlist = film.isInWatchlist;
    this._isWatched = film.isWatched;
    this._isFavorite = film.isFavorite;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film, {
      userRating: this._userRating,
      isInWatchlist: this._isInWatchlist,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite,
    });
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    const film = this._film;
    this._userRating = film.userRating;
    this._isInWatchlist = film.isInWatchlist;
    this._isWatched = film.isWatched;
    this._isFavorite = film.isFavorite;

    this.rerender();
  }

  setCloseDetailsButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, () => {
        this._isInWatchlist = !this._isInWatchlist;
        this.rerender();
      });

    element.querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, () => {
        if (this._isWatched) {
          this._userRating = null;
        }
        this._isWatched = !this._isWatched;
        this.rerender();
      });

    element.querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, () => {
        this._isFavorite = !this._isFavorite;
        this.rerender();
      });

    const userRatingElement = element.querySelector(`.film-details__user-rating-score`);

    if (userRatingElement) {
      const ratingInputs = userRatingElement.querySelectorAll(`input`);
      userRatingElement.addEventListener(`click`, (evt) => {
        if ([...ratingInputs].some((el) => el === evt.target)) {
          const rating = +evt.target.value;
          const isSameInput = this._userRating === rating;
          if (!isSameInput) {
            this._userRating = rating;
            this.rerender();
          }
        }
      });
    }
  }
}
