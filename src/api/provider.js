import nanoid from "nanoid";
import Movie from "../models/movie";
import Comment from "../models/comment";
import {getRandomArrayItem} from "../utils/common";
import {Users} from "../const";


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (this._isOnLine()) {
      return this._api.getMovies();
    }

    return Promise.resolve(Movie.parseMovies([]));
  }

  updateMovie(id, movie) {
    if (this._isOnLine()) {
      return this._api.updateMovie(id, movie);
    }

    return Promise.resolve(movie);
  }

  getComments(movieId) {
    if (this._isOnLine()) {
      return this._api.getComments(movieId);
    }

    return Promise.resolve(Comment.parseComments([]));
  }

  createComment(comment, movieId) {
    if (this._isOnLine()) {
      return this._api.createComment(comment, movieId);
    }

    // Нюанс в том, что при создании мы не указываем id задачи, нам его в ответе присылает сервер.
    // Но на случай временного хранения мы должны позаботиться и о временном id
    const fakeNewCommentId = nanoid();
    const fakeNewCommentAuthor = getRandomArrayItem(Users);

    const fakeNewComment = Comment.parseComment(Object.assign({}, comment.toRAW(), {id: fakeNewCommentId, author: fakeNewCommentAuthor}));

    return Promise.resolve(fakeNewComment);
  }

  deleteComment(id) {
    if (this._isOnLine()) {
      return this._api.deleteComment(id);
    }

    return Promise.resolve();
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
