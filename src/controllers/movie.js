import FilmCardComponent from './../components/film-card';
import FilmDetailsComponent from './../components/film-details';
import {RenderPosition, render, replace, remove} from './../utils/render';


export const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};


export default class MovieController {
  constructor(cardContainer, detailsContainer, onDataChange, onViewChange) {
    this._cardContainer = cardContainer;
    this._detailsContainer = detailsContainer;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

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

    // const closeMovieDetails = (evt) => {
    //   evt.preventDefault();
    //   this._removeDetails();
    //   document.removeEventListener(`keydown`, this._onEscKeyDown);
    // };

    this._movieCardComponent.setFilmPosterClickHandler(openMovieDetails);
    this._movieCardComponent.setFilmTitleClickHandler(openMovieDetails);
    this._movieCardComponent.setFilmCommentsClickHandler(openMovieDetails);

    this._movieCardComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isInWatchlist: !movie.isInWatchlist,
      }));
    });

    this._movieCardComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isWatched: !movie.isWatched,
      }));
    });

    this._movieCardComponent.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isFavorite: !movie.isFavorite,
      }));
    });

    this._movieDetailsComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._movieDetailsComponent.getData();
      this._onDataChange(this, movie, Object.assign({}, movie, data));
    });


    // switch (mode) {
    // case Mode.DEFAULT:
    if (oldMovieCardComponent && oldMovieDetailsComponent) {
      replace(this._movieCardComponent, oldMovieCardComponent);
      replace(this._movieDetailsComponent, oldMovieDetailsComponent);
      this._removeDetails();
    } else {
      render(this._cardContainer, this._movieCardComponent, RenderPosition.BEFOREEND);
    }
    // break;
    // }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removeDetails();
    }
  }

  // destroy() {
  //   remove(this._movieDetailsComponent);
  //   remove(this._movieCardComponent);
  //   document.removeEventListener(`keydown`, this._onEscKeyDown);
  // }

  _removeDetails() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    this._movieDetailsComponent.reset();

    remove(this._movieDetailsComponent);
    this._mode = Mode.DEFAULT;
  }

  _renderDetails() {
    this._onViewChange();

    render(this._detailsContainer, this._movieDetailsComponent, RenderPosition.BEFOREEND);
    this._mode = Mode.DETAILS;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._removeDetails();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
