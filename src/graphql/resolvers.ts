import { User } from '../models/User';
import { AuthService } from '../services/authService';
import { MailerService } from '../services/mailer';

export const resolvers = {
  Query: {
    getUser: async (_: unknown, { id }: { id: string }) => {
      return await User.findById(id);
    },
    getAllUsers: async () => {
      return await User.find();
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
