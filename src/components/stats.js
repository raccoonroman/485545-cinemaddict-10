// import Chart from 'chart.js';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chart.js/dist/Chart.min.css';
import AbstractSmartComponent from './abstract-smart-component';
import {getUserRank} from '../utils/user-rank';
import {FilterType, statsPeriods} from '../const';
import {
  getHoursAndMinutes,
  convertTextToKebabCase,
  convertToTextFromKebabCase
} from '../utils/common';


const createPeriodsMarkup = (activePeriod) => {
  return Object.values(statsPeriods)
    .map((period) => {
      const periodValue = convertTextToKebabCase(period);
      return `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${periodValue}" value="${periodValue}" ${period === activePeriod ? `checked` : ``}>
      <label for="statistic-${periodValue}" class="statistic__filters-label">${period}</label>`;
    })
    .join(`\n`);
};

const getTotalDuration = (movies) => {
  return movies.reduce((acc, {duration}) => acc + duration, 0);
};

const countMoviesByGenre = (movies, selectedGenre) => {
  const moviesByGenre = movies.filter(({genres}) => {
    return genres.some((genre) => genre === selectedGenre);
  });

  return moviesByGenre.length;
};

const countGenres = (movies) => {
  const allGenres = movies.reduce((acc, {genres}) => [...acc, ...genres], []);
  const unicGenres = [...new Set(allGenres)];
  const countedGenres = unicGenres.reduce((acc, genre) => {
    return Object.assign(acc, {[genre]: countMoviesByGenre(movies, genre)});
  }, {});

  return countedGenres;
};

const getTopGenre = (movies) => {
  const countedGenres = countGenres(movies);
  const sorterGenres = Object.entries(countedGenres).sort((a, b) => b[1] - a[1]);
  const [[topGenre]] = sorterGenres;

  return topGenre;
};

const createStatsTemplate = (watchedMovies, period) => {
  const {userRank} = getUserRank(watchedMovies);
  const {hours, minutes} = getHoursAndMinutes(getTotalDuration(watchedMovies));
  const topGenre = getTopGenre(watchedMovies);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${createPeriodsMarkup(period)}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedMovies.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};


export default class Stats extends AbstractSmartComponent {
  constructor(movies, period) {
    super();
    this._movies = movies;
    this._period = period;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createStatsTemplate(this._movies.getMoviesByFilter(FilterType.HISTORY), this._period);
  }

  show() {
    super.show();

    this.rerender(this._movies, this._period);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  rerender(movies, period) {
    this._movies = movies;
    this._period = period;

    super.rerender();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.statistic__filters`)
      .addEventListener(`change`, (evt) => {
        evt.preventDefault();
        const periodValue = evt.target.value;
        const period = convertToTextFromKebabCase(periodValue);
        this._period = period;
        this.rerender(this._movies, this._period);
      });
  }
}
