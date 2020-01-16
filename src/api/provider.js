import nanoid from 'nanoid';
import Movie from '../models/movie';
import Comment from '../models/comment';
import {getRandomArrayItem} from '../utils/common';
import {Users} from '../const';


export default class Provider {
  constructor(api, storeMovies, storeComments) {
    this._api = api;
    this._storeMovies = storeMovies;
    this._storeComments = storeComments;
  }

  getMovies() {
    if (this._isOnLine()) {
      return this._api.getMovies()
        .then((movies) => {
          movies.forEach((movie) => {
            this._storeMovies.setItem(movie.id, movie.toRAW());
          });
          return movies;
        });
    }

    const storeMovies = Object.values(this._storeMovies.getAll());
    return Promise.resolve(Movie.parseMovies(storeMovies));
  }

  getComments(movieId) {
    if (this._isOnLine()) {
      return this._api.getComments(movieId)
        .then((comments) => {
          comments.forEach((comment) => {
            this._storeComments.setItem(comment.id, Object.assign({}, comment.toRAW(), {movieId}));
          });
          return comments;
        });
    }

    const storeComments = this._storeComments.getCommentsByMovieId(movieId);
    return Promise.resolve(Comment.parseComments(storeComments));
  }

  updateMovie(id, movie) {
    if (this._isOnLine()) {
      return this._api.updateMovie(id, movie)
        .then((updatedMovie) => {
          this._storeMovies.setItem(updatedMovie.id, updatedMovie.toRAW());
          return updatedMovie;
        });
    }

    const fakeUpdatedMovie = Movie.parseMovie(Object.assign({}, movie.toRAW(), {id}));

    this._storeMovies.setItem(id, Object.assign({}, fakeUpdatedMovie.toRAW(), {offline: true}));

    return Promise.resolve(fakeUpdatedMovie);
  }

  createComment(comment, movieId) {
    if (this._isOnLine()) {
      return this._api.createComment(comment, movieId)
        .then((comments) => {
          comments.forEach((updatedComment) => {
            this._storeComments.setItem(updatedComment.id, Object.assign({}, updatedComment.toRAW(), {movieId}));
          });
          return comments;
        });
    }

    // Нюанс в том, что при создании мы не указываем id комментария, нам его в ответе присылает сервер.
    // Но на случай временного хранения мы должны позаботиться и о временном id
    const fakeNewCommentId = nanoid();
    const fakeNewCommentAuthor = getRandomArrayItem(Users);

    const fakeNewComment = Comment.parseComment(comment.toRAW());

    this._storeComments.setItem(fakeNewCommentId, Object.assign({}, fakeNewComment.toRAW(), {id: fakeNewCommentId, author: fakeNewCommentAuthor, movieId, offline: true}));

    const storeComments = this._storeComments.getCommentsByMovieId(movieId);
    return Promise.resolve(Comment.parseComments(storeComments));
  }

  deleteComment(id) {
    if (this._isOnLine()) {
      return this._api.deleteComment(id)
        .then(() => {
          this._storeComments.removeItem(id);
        });
    }

    this._storeComments.removeItem(id);
    return Promise.resolve();
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
