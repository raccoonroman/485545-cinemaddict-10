import {text} from './../const';
import {getRandomArbitrary, getRandomIntInclusive, getRandomArrayItem} from './../utils';

const filmTitles = [
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

const genres = [
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

// const getRundomCommentCount = () => getRandomIntInclusive(0, 100);
// const getPosterFileName = (filmTitle) => filmTitle
//   .split(` `)
//   .map((word) => word.toLowerCase())
//   .join(`-`);

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

const generateFilmCard = () => ({
  title: getRandomArrayItem(filmTitles),
  rate: getRandomArbitrary(0, 10).toFixed(1),
  year: getRandomIntInclusive(1940, 2020),
  genre: getRandomArrayItem(genres),
  duration: getRandomIntInclusive(10, 180),
  description: generateDescription(),
  commentsCount: getRandomIntInclusive(0, 100)
});

const generateFilmCards = (count) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(generateFilmCard());
  }
  return result;
};

export {generateFilmCard, generateFilmCards};
