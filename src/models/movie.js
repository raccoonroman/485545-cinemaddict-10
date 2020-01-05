export default class Movie {
  constructor(data) {
    this.id = data[`id`];
    this.comments = data[`comments`];
    this.filmInfo = {};
    this.filmInfo.title = data[`film_info`][`title`];
    this.filmInfo.alternativeTitle = data[`film_info`][`alternative_title`];
    this.filmInfo.totalRating = data[`film_info`][`total_rating`];
    this.filmInfo.poster = data[`film_info`][`poster`];
    this.filmInfo.ageRating = data[`film_info`][`age_rating`];
    this.filmInfo.director = data[`film_info`][`director`];
    this.filmInfo.writers = data[`film_info`][`writers`];
    this.filmInfo.actors = data[`film_info`][`actors`];
    this.filmInfo.releaseDate = data[`film_info`][`release`][`date`];
    this.filmInfo.releaseCountry = data[`film_info`][`release`][`release_country`];
    this.filmInfo.duration = data[`film_info`][`runtime`];
    this.filmInfo.genres = data[`film_info`][`genre`];
    this.filmInfo.description = data[`film_info`][`description`];

    // this.comments = [];
  }

  // toRAW() {
  //   return {
  //     'film_info': this.filmInfo,
  //   };
  // }

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }

  // static clone(data) {
  //   return new Movie(data.toRAW());
  // }
}
