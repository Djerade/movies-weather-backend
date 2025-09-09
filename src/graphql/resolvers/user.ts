
import User from "../../models/userSchema";

export default {
  Query: {
    getUser: async (_: any, { id }: { id: string }) => {
      return await User.findById(id);
    },
    getAllUsers: async () => {
      return await User.find();
    },
  },
 
  Mutation: {
    addUser: async (_, { name, email, password }) => {
      return await User.create({ name, email, password });
    },
    updateUser: async (_, { id, name, email, password }) => {
      const user = await User.findById(id);
      if (!user) {
        throw new Error("User not found");
      }
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
      if (password !== undefined) user.password = password;
      await user.save();
      return user;
    },
    deleteUser: async (_, { id }) => {
      return await User.findByIdAndDelete(id);
    },
  }
};