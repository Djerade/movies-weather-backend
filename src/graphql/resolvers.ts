import { User } from "../models/User";
import { AuthService } from "../services/authService";

export const resolvers = {
  Query: {
    getUser: async (_: any, { id }: { id: string }) => {
      return await User.findById(id);
    },
    getAllUsers: async () => {
      return await User.find();
    },
  },
 
  Mutation: {
    signup: async (_, { name, email, password, city }) => {
      if (!name || !email || !password || !city) {
        throw new Error("All fields are required");
      }
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("User already exists");
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


        return { user, token };
      } catch (error) {
        throw new Error("Error signing up"+ error);
      }
    },
  }
};
