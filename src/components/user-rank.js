import {createElement} from '../utils.js';

const userRanks = [
  {
    userRank: ``,
    check: (watchedMovies) => watchedMovies === 0,
  },
  {
    userRank: `novice`,
    check: (watchedMovies) => watchedMovies > 0 && watchedMovies <= 10,
  },
  {
    userRank: `fan`,
    check: (watchedMovies) => watchedMovies > 10 && watchedMovies <= 20,
  },
  {
    userRank: `movie buff`,
    check: (watchedMovies) => watchedMovies > 20,
  },
];

const getUserRank = (watchedMovies) => userRanks.find(({check}) => check(watchedMovies));

const createUserRankTemplate = (watchedMoviesCount) => {
  const {userRank} = getUserRank(watchedMoviesCount);

  return `<section class="header__profile profile">
    <p class="profile__rating">${userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRank {
  constructor(watchedMoviesCount) {
    this._watchedMoviesCount = watchedMoviesCount;
    this._element = null;
  }

  getTemplate() {
    return createUserRankTemplate(this._watchedMoviesCount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
