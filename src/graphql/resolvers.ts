import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { AuthService } from '../services/authService';
import { MailerService } from '../services/mailer';
import { MovieService } from '../services/movieService';
import { WeatherService } from '../services/weatherService';
import { GraphQLContext } from './context';

export const resolvers = {
  Query: {
    getUser: async (_: unknown, { id }: { id: string }) => {
      return await User.findById(id);
    },
    getAllUsers: async () => {
      return await User.find();
    },
    searchMovies: async (
      _: any,
      { query, page = 1 }: { query: string; page?: number }
    ) => {
      const result = await MovieService.searchMovies(query, page);
      return {
        search: result.Search.map((movie: any) => ({
          title: movie.Title,
          year: movie.Year,
          imdbID: movie.imdbID,
          type: movie.Type,
          poster: movie.Poster,
        })),
        totalResults: result.totalResults,
      };
    },
    getMovieById: async (_: any, { imdbId }: { imdbId: string }) => {
      return await MovieService.getMovieById(imdbId);
    },
    getMovieByTitle: async (_: any, { title }: { title: string }) => {
      return await MovieService.getMovieByTitle(title);
    },
    getAllMovies: async (_: any, { page = 1 }: { page?: number }) => {
      const result = await MovieService.getAllMovies(page);
      return {
        search: result.Search.map((movie: any) => ({
          title: movie.Title,
          year: movie.Year,
          imdbID: movie.imdbID,
          type: movie.Type,
          poster: movie.Poster,
        })),
        totalResults: result.totalResults,
      };
    },
    getFavoriteMovies: async (_: any, { userId }: { userId: string }) => {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const favoriteMovies = [];
      for (const imdbId of user.favoriteMovies) {
        try {
          const movie = await MovieService.getMovieById(imdbId);
          favoriteMovies.push({
            title: movie.Title,
            year: movie.Year,
            rated: movie.Rated,
            released: movie.Released,
            runtime: movie.Runtime,
            genre: movie.Genre,
            director: movie.Director,
            writer: movie.Writer,
            actors: movie.Actors,
            plot: movie.Plot,
            language: movie.Language,
            country: movie.Country,
            awards: movie.Awards,
            poster: movie.Poster,
            ratings: movie.Ratings,
            metascore: movie.Metascore,
            imdbRating: movie.imdbRating,
            imdbVotes: movie.imdbVotes,
            imdbID: movie.imdbID,
            type: movie.Type,
            dvd: movie.DVD,
            boxOffice: movie.BoxOffice,
            production: movie.Production,
            website: movie.Website,
          });
        } catch (error) {
          console.error(`Error fetching movie ${imdbId}:`, error);
          // Continue with other movies even if one fails
        }
      }

      return favoriteMovies;
    },
    searchFavoriteMovies: async (
      _: any,
      { userId, query }: { userId: string; query: string }
    ) => {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const favoriteMovies = [];
      for (const imdbId of user.favoriteMovies) {
        try {
          const movie = await MovieService.getMovieById(imdbId);
          // Search in title, plot, actors, director, genre
          const searchText =
            `${movie.Title} ${movie.Plot} ${movie.Actors} ${movie.Director} ${movie.Genre}`.toLowerCase();
          if (searchText.includes(query.toLowerCase())) {
            favoriteMovies.push({
              title: movie.Title,
              year: movie.Year,
              rated: movie.Rated,
              released: movie.Released,
              runtime: movie.Runtime,
              genre: movie.Genre,
              director: movie.Director,
              writer: movie.Writer,
              actors: movie.Actors,
              plot: movie.Plot,
              language: movie.Language,
              country: movie.Country,
              awards: movie.Awards,
              poster: movie.Poster,
              ratings: movie.Ratings,
              metascore: movie.Metascore,
              imdbRating: movie.imdbRating,
              imdbVotes: movie.imdbVotes,
              imdbID: movie.imdbID,
              type: movie.Type,
              dvd: movie.DVD,
              boxOffice: movie.BoxOffice,
              production: movie.Production,
              website: movie.Website,
            });
          }
        } catch (error) {
          console.error(`Error fetching movie ${imdbId}:`, error);
          // Continue with other movies even if one fails
        }
      }

      return favoriteMovies;
    },
    weather: async (
      _: any,
      { city }: { city?: string },
      context: GraphQLContext
    ) => {
      // Authentification obligatoire
      if (!context.user) {
        throw new Error('Authentication required to access weather data');
      }

      // Utiliser la ville de l'utilisateur connecté ou la ville spécifiée
      const targetCity = city || context.user.city;

      try {
        return await WeatherService.getCurrentWeather(targetCity);
      } catch (error) {
        throw new Error(
          `Failed to fetch weather: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
  },

  Mutation: {
    signup: async (_, { name, email, password, city }) => {
      if (!name || !email || !password || !city) {
        throw new Error('All fields are required');
      }
      const user = await User.findOne({ email });
      if (user) {
        throw new Error('User already exists');
      }
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
          email: email.toLowerCase(),
          password: hashedPassword,
          name: name,
          city: city,
        });

        await user.save();

        const token = AuthService.generateToken(user);

        // Send welcome email
        try {
          await MailerService.sendWelcomeEmail({
            name: user.name,
            email: user.email,
            city: user.city,
          });
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Don't fail the signup if email fails
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          city: user.city,
          favoriteMovies: user.favoriteMovies,
          token: token,
        };
      } catch (error) {
        throw new Error('Error signing up' + error);
      }
    },

    login: async (_, { email, password }) => {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      try {
        // Trouver l'utilisateur par email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await (user as any).comparePassword(password);
        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        const token = AuthService.generateToken(user);

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          city: user.city,
          favoriteMovies: user.favoriteMovies,
          token: token,
        };
      } catch (error) {
        throw new Error('Error logging in: ' + error);
      }
    },

    addFavoriteMovie: async (
      _,
      { userId, imdbId }: { userId: string; imdbId: string }
    ) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }

        // Check if movie is already in favorites
        if (user.favoriteMovies.includes(imdbId)) {
          throw new Error('Movie is already in favorites');
        }

        // Verify the movie exists by fetching it from OMDB
        try {
          await MovieService.getMovieById(imdbId);
        } catch {
          throw new Error('Movie not found');
        }

        // Add to favorites
        user.favoriteMovies.push(imdbId);
        await user.save();

        return user;
      } catch (error) {
        throw new Error('Error adding favorite movie: ' + error);
      }
    },

    removeFavoriteMovie: async (
      _,
      { userId, imdbId }: { userId: string; imdbId: string }
    ) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }

        // Remove from favorites
        user.favoriteMovies = user.favoriteMovies.filter(id => id !== imdbId);
        await user.save();

        return user;
      } catch (error) {
        throw new Error('Error removing favorite movie: ' + error);
      }
    },
  },
};
