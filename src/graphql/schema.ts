import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    city: String!
    favoriteMovies: [String!]!
  }

  type AuthPayload {
    id: ID!
    name: String!
    email: String!
    city: String!
    favoriteMovies: [String!]!
    token: String!
  }

  type Movie {
    title: String!
    year: String!
    rated: String!
    released: String!
    runtime: String!
    genre: String!
    director: String!
    writer: String!
    actors: String!
    plot: String!
    language: String!
    country: String!
    awards: String!
    poster: String!
    ratings: [Rating!]!
    metascore: String!
    imdbRating: String!
    imdbVotes: String!
    imdbID: String!
    type: String!
    dvd: String!
    boxOffice: String!
    production: String!
    website: String!
  }

  type Rating {
    source: String!
    value: String!
  }

  type MovieSearchResult {
    title: String!
    year: String!
    imdbID: String!
    type: String!
    poster: String!
  }

  type MovieSearchResponse {
    search: [MovieSearchResult!]!
    totalResults: String!
  }

  type Weather {
    city: String!
    country: String!
    temperature: Float!
    feelsLike: Float!
    humidity: Int!
    pressure: Int!
    description: String!
    icon: String!
    windSpeed: Float!
    windDirection: Int!
    visibility: Int!
    uvIndex: Float!
    sunrise: String!
    sunset: String!
  }

  type Query {
    getUser(id: ID!): User!
    getAllUsers: [User!]!
    searchMovies(query: String!, page: Int): MovieSearchResponse!
    getMovieById(imdbId: String!): Movie!
    getMovieByTitle(title: String!): Movie!
    getAllMovies(page: Int): MovieSearchResponse!
    getFavoriteMovies(userId: ID!): [Movie!]!
    searchFavoriteMovies(userId: ID!, query: String!): [Movie!]!
    weather(city: String): Weather!
  }

  type Mutation {
    signup(
      name: String!
      email: String!
      password: String!
      city: String!
    ): AuthPayload!

    login(email: String!, password: String!): AuthPayload!

    addFavoriteMovie(userId: ID!, imdbId: String!): User!
    removeFavoriteMovie(userId: ID!, imdbId: String!): User!
  }
`;
