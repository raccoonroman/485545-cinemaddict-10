import AbstractComponent from './abstract-component';


const userRanks = [
  {
    userRank: ``,
    check: (watchedMovies) => watchedMovies.length === 0,
  },
  {
    userRank: `novice`,
    check: (watchedMovies) => watchedMovies.length > 0 && watchedMovies.length <= 10,
  },
  {
    userRank: `fan`,
    check: (watchedMovies) => watchedMovies.length > 10 && watchedMovies.length <= 20,
  },
  {
    userRank: `movie buff`,
    check: (watchedMovies) => watchedMovies.length > 20,
  },
];

const getUserRank = (watchedMovies) => userRanks.find(({check}) => check(watchedMovies));

const createUserRankTemplate = (watchedMovies) => {
  const {userRank} = getUserRank(watchedMovies);

  return `<section class="header__profile profile">
    <p class="profile__rating">${userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};


export default class UserRank extends AbstractComponent {
  constructor(watchedMovies) {
    super();
    this._watchedMovies = watchedMovies;
  }

  getTemplate() {
    return createUserRankTemplate(this._watchedMovies);
  }
}
