import axios from 'axios';
import { config } from '../config/env';

export interface Movie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface SearchResult {
  Search: Array<{
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  }>;
  totalResults: string;
  Response: string;
}

export class MovieService {
  private static readonly BASE_URL = 'https://www.omdbapi.com/';

  static async searchMovies(query: string, page: number = 1): Promise<SearchResult> {
    try {
      const response = await axios.get(this.BASE_URL, {
        params: {
          apikey: config.omdbApiKey,
          s: query,
          page: page,
        },
      });

      if (response.data.Response === 'False') {
        throw new Error(response.data.Error || 'Movie search failed');
      }

      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw new Error('Failed to search movies');
    }
  }

  static async getMovieById(imdbId: string): Promise<Movie> {
    try {
      const response = await axios.get(this.BASE_URL, {
        params: {
          apikey: config.omdbApiKey,
          i: imdbId,
          plot: 'full',
        },
      });

      if (response.data.Response === 'False') {
        throw new Error(response.data.Error || 'Movie not found');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching movie:', error);
      throw new Error('Failed to fetch movie details');
    }
  }

  static async getMovieByTitle(title: string): Promise<Movie> {
    try {
      const response = await axios.get(this.BASE_URL, {
        params: {
          apikey: config.omdbApiKey,
          t: title,
          plot: 'full',
        },
      });

      if (response.data.Response === 'False') {
        throw new Error(response.data.Error || 'Movie not found');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching movie by title:', error);
      throw new Error('Failed to fetch movie details');
    }
  }

  static async getAllMovies(page: number = 1): Promise<SearchResult> {
    try {
      // Utiliser une recherche générique pour récupérer des films populaires
      const response = await axios.get(this.BASE_URL, {
        params: {
          apikey: config.omdbApiKey,
          s: 'movie', // Terme générique pour récupérer des films
          page: page,
          type: 'movie', // S'assurer que nous récupérons seulement des films
        },
      });

      if (response.data.Response === 'False') {
        throw new Error(response.data.Error || 'Failed to fetch movies');
      }

      console.log('OMDB Response structure:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error('Error fetching all movies:', error);
      throw new Error('Failed to fetch movies');
    }
  }
}
