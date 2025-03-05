import { gql } from '@apollo/client';

// Fetch the logged-in user's data
export const GET_ME = gql`
  query Me {
    me {
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