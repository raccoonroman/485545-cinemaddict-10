import {text, Emotions} from '../const';
import {
  getRandomArbitrary,
  getRandomIntInclusive,
  getRandomArrayItem,
  getRandomBooleanValue,
  getFileName,
} from './../utils/common';

const FilmTitles = [
  `The Blind Side`,
  `Casablanca`,
  `Edge of Tomorrow`,
  `The Butterfly Effect`,
  `The Godfather`,
  `Apocalypto`,
  `Captain Fantastic`,
  `Cruel Intentions`,
  `Hacksaw Ridge`,
  `Forrest Gump`,
  `Interstellar`,
  `It's a Wonderful Life`,
  `Leon`,
  `Platoon`,
  `The Shawshank Redemption`,
];

const Genres = [
  `Action`,
  `Animation`,
  `Cartoon`,
  `Comedy`,
  `Crime`,
  `Drama`,
  `Experimental`,
  `Fantasy`,
  `Historical`,
  `Horror`,
  `Musical`,
  `Romance`,
  `Sci-Fi`,
  `Thriller`,
  `Western`,
];

const Users = [
  `Sasha`,
  `Paul van Dyk`,
  `Armin Van Buuren`,
  `Ferry Corsten`,
  `Christopher Lawrence`,
  `ATB`,
  `Marco V`,
  `Benny Benassi`,
  `Johan Gielen`,
  `Markus Schulz`,
  `Above & Beyond`,
  `Max Graham`,
];

const threeDaysInMs = 1000 * 60 * 60 * 24 * 3;
const hundredYears = 100;
const yearInMs = 1000 * 60 * 60 * 24 * 365;

const getRandomRating = () => +getRandomArbitrary(1, 9).toFixed(1);

const getRandomDate = (period) => {
  const currentDate = Date.now();
  const diffDate = getRandomIntInclusive(0, period);
  return new Date(currentDate - diffDate);
};

const getRandomReleaseDate = () => {
  const targetDate = new Date();
  const diffYear = getRandomIntInclusive(0, hundredYears);
  targetDate.setFullYear(targetDate.getFullYear() - diffYear);

  return targetDate;
};


const generateDescription = () => {
  const sentences = text
    .trim()
    .slice(0, -1)
    .split(`. `)
    .map((sentence) => `${sentence}.`);

  const sentencesAmount = getRandomIntInclusive(1, 3);
  const result = [];

  for (let i = 0; i < sentencesAmount; i++) {
    result.push(getRandomArrayItem(sentences));
  }

  return result.join(` `);
};

const generateGenres = (genres) => genres
  .filter(getRandomBooleanValue)
  .slice(0, getRandomIntInclusive(1, 3));

const generateComment = () => {
  return {
    id: String(new Date() + Math.random()),
    text: generateDescription(),
    emotion: getRandomArrayItem(Emotions),
    author: getRandomArrayItem(Users),
    date: getRandomDate(threeDaysInMs),
  };
};

const generateComments = () => {
  const commentsAmount = getRandomIntInclusive(0, 5);
  const result = [];

  for (let i = 0; i < commentsAmount; i++) {
    result.push(generateComment());
  }

  return result;
};


const generateFilm = () => {
  const title = getRandomArrayItem(FilmTitles);
  const isWatched = getRandomBooleanValue();
  const userRating = getRandomBooleanValue() ? getRandomIntInclusive(1, 9) : null;
  const totalRating = getRandomBooleanValue() ? getRandomRating() : null;

  return {
    id: String(new Date() + Math.random()),
    filmInfo: {
      title,
      alternativeTitle: `alternative title`,
      totalRating,
    },
    poster: `./images/posters/${getFileName(title)}.jpg`,
    userRating: isWatched ? userRating : null,
    ageRating: getRandomIntInclusive(0, 21),
    director: getRandomArrayItem(Users),
    releaseDate: getRandomReleaseDate(),
    genres: [...new Set(generateGenres(Genres))],
    duration: getRandomIntInclusive(10, 180),
    description: generateDescription(),
    isInWatchlist: getRandomBooleanValue(),
    isWatched,
    watchingDate: isWatched ? getRandomDate(yearInMs) : null,
    isFavorite: getRandomBooleanValue(),
    comments: generateComments(),
  };
};


const generateFilms = (count) => {
  const result = [];

  for (let i = 0; i < count; i++) {
    result.push(generateFilm());
  }

  return result;
};

export {generateFilm, generateFilms};
