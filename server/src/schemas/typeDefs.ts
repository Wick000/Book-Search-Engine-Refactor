import { gql } from 'graphql-tag';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    savedBooks: [Book]!
    bookCount: Int
  }

  type Book {
    bookId: String!
    title: String!
    authors: [String]
    description: String!
    image: String
   # link: String
  }

  type Auth {
    token: String!
    user: User!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  input BookInput {
    bookId: String!
    title: String!
    authors: [String]
    description: String!
    image: String
   # link: String
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(userData: UserInput!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;
