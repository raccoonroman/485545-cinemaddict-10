export default class MovieComment {
  constructor(data) {
    this.id = data[`id`];
    this.author = data[`author`];
    this.text = data[`comment`];
    this.date = data[`date`];
    this.emotion = data[`emotion`];
  }

  // toRAW() {
  //   return {
  //     'film_info': this.filmInfo,
  //   };
  // }

  static parseMovieComment(data) {
    return new MovieComment(data);
  }

  static parseMovieComments(data) {
    return data.map(MovieComment.parseMovieComment);
  }

  // static clone(data) {
  //   return new Movie(data.toRAW());
  // }
}
