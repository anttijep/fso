const { v1: uuid } = require("uuid");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const { UserInputError, AuthenticationError } = require("apollo-server");

const JWT_SECRET = process.env.SECRET || "NO_SECRET";

const { dauthors, dbooks } = require("./utils");

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments({}),
    authorCount: async () => Author.countDocuments({}),
    allBooks: async (_root, args) => {
      const filter = {};
      if (args.author) {
        const authordb = await Author.findOne({ name: args.author });
        if (!authordb) {
          throw new UserInputError("Failed to find author", {
            invalidArgs: args,
          });
        }
        filter.author = authordb._id;
      }
      if (args.genre) {
        filter.genres = args.genre;
      }
      return Book.find(filter).populate("author");
    },
    allAuthors: async () => {
      return Author.find({});
    },
    allGenres: async () => {
      return Book.find({}).distinct("genres");
    },
    me: (_root, _args, { user }) => {
      if (!user) {
        throw new AuthenticationError("No auth");
      }
      return user;
    },
  },
  Author: {
    bookCount: async (root) => root.books.length,
  },
  Mutation: {
    addBook: async (_root, args, { user }) => {
      if (!user) {
        throw new AuthenticationError("No auth");
      }
      const genres = args.genres.filter((g) => Boolean(g));
      if (!genres.length) {
        throw new UserInputError("empty genres", {
          invalidArgs: args,
        });
      }
      try {
        let author = await Author.findOne({ name: args.author });
        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
        }
        const book = new Book({ ...args, author: author._id, genres });
        await book.save();
        author.books.push(book);
        await author.save();
        await book.populate("author");
        pubsub.publish("BOOK_ADDED", { bookAdded: book });
        return book;
      } catch (ex) {
        throw new UserInputError(ex.message, {
          invalidArgs: args,
        });
      }
    },
    editAuthor: async (_root, args, { user }) => {
      if (!user) {
        throw new AuthenticationError("No auth");
      }
      const author = await Author.findOne({ name: args.name });
      if (author) {
        author.born = args.setBornTo;
        try {
          author.save();
        } catch (ex) {
          throw new UserInputError(ex.message, {
            invalidArgs: args,
          });
        }
      }
      return author;
    },
    createUser: async (_root, args) => {
      const user = new User({ ...args });
      try {
        await user.save();
      } catch (ex) {
        throw new UserInputError(ex.message, {
          invalidArgs: args,
        });
      }
      return user;
    },
    login: async (_root, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user || password !== "test") {
        throw new UserInputError("Wrong username or password");
      }
      const token = {
        username: user.username,
        id: user._id,
      };
      return { value: jwt.sign(token, JWT_SECRET) };
    },
    resetDB: async () => {
      await Book.deleteMany({});
      await Author.deleteMany({});
      const authors = await Promise.all(
        dauthors.map((a) => new Author(a).save())
      );
      const books = await Promise.all(
        dbooks.map((b) =>
          new Book({
            ...b,
            author: authors.find((a) => a.name === b.author)._id,
          }).save()
        )
      );
      authors.forEach((a) => {
        books.forEach((b) => {
          if (a._id === b.author._id) {
            a.books.push(b);
          }
        });
      });
      await Promise.all(authors.map((a) => a.save()));
      return "done";
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },
};

module.exports = resolvers;
