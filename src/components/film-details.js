import he from 'he';
import AbstractSmartComponent from './abstract-smart-component';
import {Emotions} from '../const';
import {
  formatDuration,
  formatDate,
  formatRelativeTime,
  getFileName,
  createRatingText,
} from '../utils/common';


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
    const {id, text, emotion, author, date} = comment;
    return `<li class="film-details__comment" data-comment-id="${id}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
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

const createEmojiMarkup = (activeEmotion) => Emotions
  .map((emotion) => {
    return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${emotion === activeEmotion ? `checked` : ``}>
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>`;
  })
  .join(`\n`);

const createSelectedEmotionMarkup = (emotion) => {
  return emotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji">` : ``;
};

const createGenresTitleText = (genres) => genres.length > 1 ? `Genres` : `Genre`;


const createFilmDetailsTemplate = (film, options = {}) => {
  const {
    title,
    releaseDate,
    duration,
    genres,
    description,
  } = film;

  const {
    rating,
    userRating,
    isInWatchlist,
    isWatched,
    isFavorite,
    comments,
    emotion,
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
            <div for="add-emoji" class="film-details__add-emoji-label">
            ${createSelectedEmotionMarkup(emotion)}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              ${createEmojiMarkup(emotion)}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

const parseFormData = (formData) => {
  const isChecked = (name) => formData.get(name) === `on`;

  return {
    userRating: +formData.get(`score`),
    isInWatchlist: isChecked(`watchlist`),
    isWatched: isChecked(`watched`),
    isFavorite: isChecked(`favorite`),
  };
};


export default class FilmDetails extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
    this._rating = film.rating;
    this._userRating = film.userRating;
    this._isInWatchlist = film.isInWatchlist;
    this._isWatched = film.isWatched;
    this._isFavorite = film.isFavorite;
    this._comments = film.comments;
    this._watchingDate = film.watchingDate;

    this._emotion = null;
    this._commentText = null;

    this._submitHandler = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film, {
      rating: this._rating,
      userRating: this._userRating,
      isInWatchlist: this._isInWatchlist,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite,
      comments: this._comments,
      emotion: this._emotion,
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    const film = this._film;
    this._rating = film.rating;
    this._userRating = film.userRating;
    this._isInWatchlist = film.isInWatchlist;
    this._isWatched = film.isWatched;
    this._isFavorite = film.isFavorite;
    this._comments = film.comments;
    this._watchingDate = film.watchingDate;

    this._emotion = null;
    this._commentText = null;

    this.rerender();
  }

  getData() {
    const form = this.getElement().querySelector(`.film-details__inner`);
    const formData = new FormData(form);

    return Object.assign({}, parseFormData(formData), {
      rating: this._rating,
      comments: this._comments,
      watchingDate: this._watchingDate,
    });
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);

    this._submitHandler = handler;
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
        this._watchingDate = this._isWatched ? null : new Date();
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
      userRatingElement.addEventListener(`change`, (evt) => {
        const userRating = +evt.target.value;

        if (!this._rating) {
          this._rating = userRating;
        }

        this._userRating = userRating;
        this.rerender();
      });
    }

    const userRatingUndoButton = element.querySelector(`.film-details__watched-reset`);
    if (userRatingUndoButton) {
      userRatingUndoButton.addEventListener(`click`, () => {
        this._userRating = null;
        this.rerender();
      });
    }

    element.querySelectorAll(`.film-details__comment-delete`).forEach((deleteButton) => {
      deleteButton.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        const commentElement = deleteButton.closest(`.film-details__comment`);
        const commentId = commentElement.dataset.commentId;
        const index = this._comments.findIndex((it) => it.id === commentId);
        this._comments = [].concat(this._comments.slice(0, index), this._comments.slice(index + 1));
        this.rerender();
      });
    });

    element.querySelector(`.film-details__emoji-list`).addEventListener(`change`, (evt) => {
      const emotion = evt.target.value;
      this._emotion = emotion;

      this.rerender();
    });

    element.querySelector(`.film-details__comment-input`).addEventListener(`input`, (evt) => {
      this._commentText = evt.target.value;
    });

    element.addEventListener(`keydown`, (evt) => {
      if (evt.ctrlKey && evt.keyCode === 13) {
        if (this._emotion && this._commentText) {
          const newComment = {
            id: String(new Date() + Math.random()),
            text: he.encode(this._commentText),
            emotion: this._emotion,
            author: `You`,
            date: new Date(),
          };

          this._comments.push(newComment);
          this._emotion = null;
          this._commentText = null;
          this.rerender();
        }
      }
    });
  }
}
