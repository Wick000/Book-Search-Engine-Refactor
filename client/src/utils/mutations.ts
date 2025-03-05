import { gql } from '@apollo/client';

// Register a new user
export const ADD_USER = gql`
  mutation AddUser($userData: UserInput!) {
    addUser(userData: $userData) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

// Log in an existing user
export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

// Save a book to the user's list
// export const SAVE_BOOK = gql`
//   mutation SaveBook($bookData: BookInput!) {
//     saveBook(bookData: $bookData) {
//       id
//       username
//       savedBooks {
//         bookId
//         title
//         authors
//         description
//         image
//         link
//       }
//     }
//   }
// `;

export const SAVE_BOOK = gql`
  mutation SaveBook(
    $bookId: String!
    $authors: [String]
    $title: String!
    $description: String!
    $image: String
    #$link: String
  ) {
    saveBook(
      bookData: {
        bookId: $bookId
        authors: $authors
        title: $title
        description: $description
        image: $image
        #link: $link
      }
    ) {
      id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        #link
      }
    }
  }
`;

// Remove a book from the user's list
export const REMOVE_BOOK = gql`
  mutation RemoveBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      id
      username
      savedBooks {
        bookId
        title
        authors
      }
    }
  }
`;