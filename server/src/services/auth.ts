import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
//import { Request } from 'express';
dotenv.config();

// interface JwtPayload {
//   _id: string;
//   username: string;
//   email: string;
// }

// interface AuthRequest extends Request {
//   user?: JwtPayload;  // Add user to the request object
// }

export const authenticateToken = ({ req }: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (typeof token === 'string' && req.headers.authorization) {
    // If the token is in the authorization header, split and clean it
    token = token.split(' ').pop()?.trim();
  }

  if (!token) {
    throw new AuthenticationError('Token not provided');
  }

  try {
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2h' });
    req.user = data;  // Attach the decoded user info to the request object
  } catch (err) {
    throw new AuthenticationError('Invalid token');
  }

  return req;  // Return the request with the attached user info
};

export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is missing in the environment variables');
  }

  return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};

// Custom AuthenticationError for better handling in GraphQL
export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};