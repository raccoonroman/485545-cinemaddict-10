import FilmCardComponent from './../components/film-card';
import FilmDetailsComponent from './../components/film-details';
import {RenderPosition, render, replace, remove} from './../utils/render';


const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};


export default class MovieController {
  constructor(cardContainer, detailsContainer, onDataChange) {
    this._cardContainer = cardContainer;
    this._detailsContainer = detailsContainer;
    this._onDataChange = onDataChange;

    this._mode = Mode.DEFAULT;

    this._movieCardComponent = null;
    this._movieDetailsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(movie) {
    const oldMovieCardComponent = this._movieCardComponent;
    const oldMovieDetailsComponent = this._movieDetailsComponent;

    this._movieCardComponent = new FilmCardComponent(movie);
    this._movieDetailsComponent = new FilmDetailsComponent(movie);

    const openMovieDetails = (evt) => {
      evt.preventDefault();
      this._renderDetails();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    };

    const closeMovieDetails = (evt) => {
      evt.preventDefault();
      this._removeDetails();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    };

    this._movieCardComponent.setFilmPosterClickHandler(openMovieDetails);
    this._movieCardComponent.setFilmTitleClickHandler(openMovieDetails);
    this._movieCardComponent.setFilmCommentsClickHandler(openMovieDetails);
    this._movieDetailsComponent.setCloseDetailsButtonClickHandler(closeMovieDetails);


    this._movieCardComponent.setWatchlistButtonClickHandler(() => {
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isInWatchlist: !movie.isInWatchlist,
      }));
    });

    this._movieCardComponent.setWatchedButtonClickHandler(() => {
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isWatched: !movie.isWatched,
      }));
    });

    this._movieCardComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isFavorite: !movie.isFavorite,
      }));
    });


    if (oldMovieCardComponent && oldMovieDetailsComponent) {
      replace(this._movieCardComponent, oldMovieCardComponent);
      replace(this._movieDetailsComponent, oldMovieDetailsComponent);
    } else {
      render(this._cardContainer, this._movieCardComponent, RenderPosition.BEFOREEND);
    }
  }

  _renderDetails() {
    render(this._detailsContainer, this._movieDetailsComponent, RenderPosition.BEFOREEND);
    this._mode = Mode.DETAILS;
  }

  _removeDetails() {
    // this._movieDetailsComponent.reset();
    remove(this._movieDetailsComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._removeDetails();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
