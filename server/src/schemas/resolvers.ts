import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import { GraphQLError } from 'graphql';

// Define argument types
interface LoginArgs {
  email: string;
  password: string;
}

interface UserInputArgs {
  userData: {
    username: string;
    email: string;
    password: string;
  };
}

interface BookInputArgs {
  bookData: {
    bookId: string;
    title: string;
    authors?: string[];
    description: string;
    image?: string;
    link?: string;
  };
}

interface RemoveBookArgs {
  bookId: string;
}

export interface UserContext {
    user?: {
      _id: string;
      username: string;
      email: string;
    };
  }

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: UserContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      return await User.findById(context.user._id);
    },
  },

  Mutation: {
    login: async (_parent: any, { email, password }: LoginArgs) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new GraphQLError('Invalid credentials', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      const token = signToken(user.username, user.email, user.id);
      return { token, user };
    },

    addUser: async (_parent: any, { userData }: UserInputArgs) => {
      const user = await User.create(userData);
      const token = signToken(user.username, user.email, user.id);
      return { token, user };
    },

    saveBook: async (_parent: any, { bookData }: BookInputArgs, context: UserContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      }
      //console.log(bookData)
      return await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: bookData  }},
        { new: true }
      );
    },

    removeBook: async (_parent: any, { bookId }: RemoveBookArgs, context: UserContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      return await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};

export default resolvers;
