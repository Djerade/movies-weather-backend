import { User } from '../models/User';
import { AuthService } from '../services/authService';
import { MailerService } from '../services/mailer';
import { MovieService } from '../services/movieService';

export const resolvers = {
  Query: {
    getUser: async (_: unknown, { id }: { id: string }) => {
      return await User.findById(id);
    },
    getAllUsers: async () => {
      return await User.find();
    },
    searchMovies: async (_: any, { query, page = 1 }: { query: string; page?: number }) => {
      const result = await MovieService.searchMovies(query, page);
      return {
        search: result.Search,
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
        search: result.Search,
        totalResults: result.totalResults,
      };
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
        const user = new User({
          email: email.toLowerCase(),
          password: password,
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
          ...user._doc,
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

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        const token = AuthService.generateToken(user);

        return {
          id: user._id,
          ...user._doc,
          token: token,
        };
      } catch (error) {
        throw new Error('Error logging in: ' + error);
      }
    },
  },
};
