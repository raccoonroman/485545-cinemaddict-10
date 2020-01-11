import he from 'he';
import FilmCardComponent from './../components/film-card';
import FilmDetailsComponent from './../components/film-details';
import MovieModel from '../models/movie';
import MovieCommentModel from '../models/movie-comment';
import {RenderPosition, render, replace, remove} from './../utils/render';


export const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};

export default class MovieController {
  constructor(cardContainer, detailsContainer, onDataChange, onViewChange, api) {
    this._cardContainer = cardContainer;
    this._detailsContainer = detailsContainer;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._api = api;

    this._mode = Mode.DEFAULT;

    this._movieCardComponent = null;
    this._movieDetailsComponent = null;
  }

  render(movie) {
    const oldMovieCardComponent = this._movieCardComponent;
    const oldMovieDetailsComponent = this._movieDetailsComponent;

    this._movieCardComponent = new FilmCardComponent(movie);
    this._movieDetailsComponent = new FilmDetailsComponent(movie);

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        closeMovieDetails(evt);
      }
    };

    const openMovieDetails = (evt) => {
      evt.preventDefault();
      this._onViewChange();

      render(this._detailsContainer, this._movieDetailsComponent, RenderPosition.BEFOREEND);

      this._mode = Mode.DETAILS;

      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const closeMovieDetails = (evt) => {
      evt.preventDefault();

      const data = this._movieDetailsComponent.getData();
      this._onDataChange(this, movie, Object.assign({}, movie, data));

      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    this._movieCardComponent.setFilmPosterClickHandler(openMovieDetails);
    this._movieCardComponent.setFilmTitleClickHandler(openMovieDetails);
    this._movieCardComponent.setFilmCommentsClickHandler(openMovieDetails);

    const watchlistItemClickHandler = (evt) => {
      evt.preventDefault();
      const newMovie = MovieModel.clone(movie);
      newMovie.isInWatchlist = !newMovie.isInWatchlist;

      return this._onDataChange(this, movie, newMovie);
    };

    const watchedItemClickHandler = (evt) => {
      evt.preventDefault();
      const newMovie = MovieModel.clone(movie);
      newMovie.isWatched = !newMovie.isWatched;
      if (newMovie.isWatched) {
        newMovie.watchingDate = new Date();
      }
      if (!newMovie.isWatched) {
        newMovie.userRating = 0;
      }

      return this._onDataChange(this, movie, newMovie);
    };

    const favoriteItemClickHandler = (evt) => {
      evt.preventDefault();
      const newMovie = MovieModel.clone(movie);
      newMovie.isFavorite = !newMovie.isFavorite;

      return this._onDataChange(this, movie, newMovie);
    };

    this._movieCardComponent.setWatchlistButtonClickHandler(watchlistItemClickHandler);
    this._movieCardComponent.setWatchedButtonClickHandler(watchedItemClickHandler);
    this._movieCardComponent.setFavoriteButtonClickHandler(favoriteItemClickHandler);


    this._movieDetailsComponent.setWatchlistItemClickHandler((evt) => {
      watchlistItemClickHandler(evt).then(() => openMovieDetails(evt));
    });

    this._movieDetailsComponent.setWatchedItemClickHandler((evt) => {
      watchedItemClickHandler(evt).then(() => openMovieDetails(evt));
    });

    this._movieDetailsComponent.setFavoriteItemClickHandler((evt) => {
      favoriteItemClickHandler(evt).then(() => openMovieDetails(evt));
    });

    this._movieDetailsComponent.setUserRatingClickHandler((evt) => {
      const userRating = +evt.target.value;
      const newMovie = MovieModel.clone(movie);
      newMovie.userRating = userRating;

      this._onDataChange(this, movie, newMovie)
        .then(() => openMovieDetails(evt));
    });

    this._movieDetailsComponent.setUndoUserRatingClickHandler((evt) => {
      const newMovie = MovieModel.clone(movie);
      newMovie.userRating = 0;

      this._onDataChange(this, movie, newMovie)
        .then(() => openMovieDetails(evt));
    });

    this._movieDetailsComponent.setDeleteCommentClickHandler((evt) => {
      evt.preventDefault();
      const commentElement = evt.target.closest(`.film-details__comment`);
      const commentId = commentElement.dataset.commentId;
      this._api.deleteComment(commentId)
        .then(() => MovieModel.clone(movie))
        .then((newMovie) => {
          newMovie.commentsId = newMovie.commentsId.filter((id) => id !== commentId);
          return this._onDataChange(this, movie, newMovie);
        })
        .then(() => openMovieDetails(evt));
    });

    this._movieDetailsComponent.setSubmitCommentHandler((evt) => {
      if (evt.ctrlKey && evt.keyCode === 13) {
        const emotion = this._movieDetailsComponent.emotion;
        const commentText = this._movieDetailsComponent.commentText;

        if (emotion && commentText) {
          const newComment = new MovieCommentModel({
            'comment': he.encode(commentText),
            'date': new Date(),
            'emotion': emotion,
          });

          this._api.createComment(newComment, movie.id)
            .then(() => MovieModel.clone(movie))
            .then((newMovie) => this._onDataChange(this, movie, newMovie))
            .then(() => openMovieDetails(evt));
        }
      }
    });

    // this._movieDetailsComponent.setSubmitHandler(closeMovieDetails);


    // switch (mode) {
    // case Mode.DEFAULT:
    if (oldMovieCardComponent && oldMovieDetailsComponent) {
      replace(this._movieCardComponent, oldMovieCardComponent);
      replace(this._movieDetailsComponent, oldMovieDetailsComponent);
      this._removeDetailsWithoutSaving();
    } else {
      render(this._cardContainer, this._movieCardComponent, RenderPosition.BEFOREEND);
    }
    // break;
    // }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removeDetailsWithoutSaving();
    }
  }

  // destroy() {
  //   remove(this._movieDetailsComponent);
  //   remove(this._movieCardComponent);
  //   document.removeEventListener(`keydown`, this._onEscKeyDown);
  // }

  _removeDetailsWithoutSaving() {
    this._movieDetailsComponent.reset();

    remove(this._movieDetailsComponent);

    this._movieDetailsComponent.recoveryListeners();
    this._mode = Mode.DEFAULT;
  }
}
