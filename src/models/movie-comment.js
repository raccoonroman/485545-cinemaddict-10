export default class MovieComment {
  constructor(data) {
    this.id = data[`id`];
    this.author = data[`author`];
    this.text = data[`comment`];
    this.date = data[`date`];
    this.emotion = data[`emotion`];
  }

  toRAW() {
    return {
      'id': this.id,
      'author': this.author,
      'comment': this.text,
      'date': this.date,
      'emotion': this.emotion,
    };
  }

  static parseMovieComment(data) {
    return new MovieComment(data);
  }

  static parseMovieComments(data) {
    return data.map(MovieComment.parseMovieComment);
  }

  static clone(data) {
    return new MovieComment(data.toRAW());
  }
}
