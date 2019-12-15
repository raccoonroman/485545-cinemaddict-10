import {text} from './../const';
import {
  getRandomArbitrary,
  getRandomIntInclusive,
  getRandomArrayItem,
  getRandomBooleanValue,
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

const getRandomRating = () => +getRandomArbitrary(1, 9).toFixed(1);

const getRandomDate = () => {
  const targetDate = new Date();
  const diffYear = getRandomIntInclusive(0, 100);
  targetDate.setFullYear(targetDate.getFullYear() - diffYear);

  return targetDate;
};


const generateFilm = () => {
  const rating = getRandomBooleanValue() ? getRandomRating() : null;
  const userRating = getRandomBooleanValue() ? getRandomIntInclusive(1, 9) : null;
  const isWatched = getRandomBooleanValue();

  return {
    title: getRandomArrayItem(FilmTitles),
    rating,
    userRating: isWatched && rating ? userRating : null,
    releaseDate: getRandomDate(),
    genres: [...new Set(generateGenres(Genres))],
    duration: getRandomIntInclusive(10, 180),
    description: generateDescription(),
    commentsCount: getRandomIntInclusive(0, 100),
    isInWatchlist: getRandomBooleanValue(),
    isWatched,
    isFavorite: getRandomBooleanValue(),
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
