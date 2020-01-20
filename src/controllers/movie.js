import he from 'he';
import FilmCardComponent from './../components/film-card';
import FilmDetailsComponent from './../components/film-details';
import MovieModel from '../models/movie';
import CommentModel from '../models/comment';
import {RenderPosition, render, replace, remove} from './../utils/render';


const ProcessText = {
  UNDOING: `Undoing...`,
  DELETING: `Deleting...`,
};

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

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._removeDetails = this._removeDetails.bind(this);
    this._renderDetails = this._renderDetails.bind(this);
  }

  render(movie) {
    const oldMovieCardComponent = this._movieCardComponent;
    const oldMovieDetailsComponent = this._movieDetailsComponent;

    this._movieCardComponent = new FilmCardComponent(movie);
    this._movieDetailsComponent = new FilmDetailsComponent(movie);

    this._movieCardComponent.setFilmPosterClickHandler(this._renderDetails);
    this._movieCardComponent.setFilmTitleClickHandler(this._renderDetails);
    this._movieCardComponent.setFilmCommentsClickHandler(this._renderDetails);

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
      const scrollTop = this._movieDetailsComponent.getScrollTop();
      watchlistItemClickHandler(evt)
        .then(() => {
          this._renderDetails();
          this._movieDetailsComponent.setScrollTop(scrollTop);
        });
    });

    this._movieDetailsComponent.setWatchedItemClickHandler((evt) => {
      const scrollTop = this._movieDetailsComponent.getScrollTop();
      watchedItemClickHandler(evt)
        .then(() => {
          this._renderDetails();
          this._movieDetailsComponent.setScrollTop(scrollTop);
        });
    });

    this._movieDetailsComponent.setFavoriteItemClickHandler((evt) => {
      const scrollTop = this._movieDetailsComponent.getScrollTop();
      favoriteItemClickHandler(evt)
        .then(() => {
          this._renderDetails();
          this._movieDetailsComponent.setScrollTop(scrollTop);
        });
    });


    this._movieDetailsComponent.setUserRatingClickHandler((evt) => {
      const scrollTop = this._movieDetailsComponent.getScrollTop();
      this._movieDetailsComponent.disableUserRatingInputs();

      const userRating = +evt.target.value;
      const newMovie = MovieModel.clone(movie);

      newMovie.userRating = userRating;

      this._onDataChange(this, movie, newMovie)
        .then(() => {
          this._renderDetails();
          this._movieDetailsComponent.setScrollTop(scrollTop);
        })
        .catch(() => this._movieDetailsComponent.shakeRatingItem(evt.target));
    });

    this._movieDetailsComponent.setUndoUserRatingClickHandler((evt) => {
      const scrollTop = this._movieDetailsComponent.getScrollTop();
      evt.target.textContent = ProcessText.UNDOING;
      const newMovie = MovieModel.clone(movie);
      newMovie.userRating = 0;

      this._onDataChange(this, movie, newMovie)
        .then(() => {
          this._renderDetails();
          this._movieDetailsComponent.setScrollTop(scrollTop);
        });
    });

    this._movieDetailsComponent.setDeleteCommentClickHandler((evt) => {
      evt.preventDefault();
      const button = evt.target;
      const scrollTop = this._movieDetailsComponent.getScrollTop();
      const commentElement = this._movieDetailsComponent.getClosestComment(button);
      const commentId = commentElement.dataset.commentId;

      button.disabled = true;
      button.textContent = ProcessText.DELETING;

      this._api.deleteComment(commentId)
        .then(() => MovieModel.clone(movie))
        .then((newMovie) => {
          newMovie.commentsId = newMovie.commentsId.filter((id) => id !== commentId);
          return this._onDataChange(this, movie, newMovie);
        })
        .then(() => {
          this._renderDetails();
          this._movieDetailsComponent.setScrollTop(scrollTop);
        });
    });

    this._movieDetailsComponent.setSubmitCommentHandler((evt) => {
      if (evt.ctrlKey && evt.keyCode === 13) {
        const emotion = this._movieDetailsComponent.emotion;
        const commentText = this._movieDetailsComponent.commentText;

        if (emotion && commentText) {
          const scrollTop = this._movieDetailsComponent.getScrollTop();
          this._movieDetailsComponent.disableCommentForm();

          const newComment = new CommentModel({
            'comment': he.encode(commentText),
            'date': new Date(),
            'emotion': emotion,
          });

          this._api.createComment(newComment, movie.id)
            .then(() => MovieModel.clone(movie))
            .then((newMovie) => this._onDataChange(this, movie, newMovie))
            .then(() => {
              this._renderDetails();
              this._movieDetailsComponent.setScrollTop(scrollTop);
            })
            .catch(() => this._movieDetailsComponent.shakeCommentForm());
        }
      }
    });

    this._movieDetailsComponent.setCloseButtonHandler(this._removeDetails);

    if (oldMovieCardComponent && oldMovieDetailsComponent) {
      replace(this._movieCardComponent, oldMovieCardComponent);
      replace(this._movieDetailsComponent, oldMovieDetailsComponent);
      this._removeDetailsWithoutSaving();
    } else {
      render(this._cardContainer, this._movieCardComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removeDetailsWithoutSaving();
    }
  }

  _renderDetails() {
    this._onViewChange();

    render(this._detailsContainer, this._movieDetailsComponent, RenderPosition.BEFOREEND);

    this._mode = Mode.DETAILS;

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _removeDetails() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    remove(this._movieDetailsComponent);

    this._movieDetailsComponent.recoveryListeners();
    this._mode = Mode.DEFAULT;
  }

  _removeDetailsWithoutSaving() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    this._movieDetailsComponent.reset();

    remove(this._movieDetailsComponent);

    this._movieDetailsComponent.recoveryListeners();
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._removeDetails();
    }
  }
}
