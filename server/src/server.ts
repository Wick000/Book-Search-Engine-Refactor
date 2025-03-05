import express, {Request, Response} from 'express';
import path from 'node:path';
import db from './config/connection.js';
//import routes from './routes/index.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js' // the routes folder should become the schema folder
import { authenticateToken } from './services/auth.js'; //need to change services to utils folder
import { UserContext } from './schemas/resolvers.js';


const server = new ApolloServer<UserContext>({
  typeDefs,
  resolvers,
    
});

const startApolloServer = async () => {
  await server.start();
  await db();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/graphql', expressMiddleware(server as any,
  {  // uncomment when signup and login are working
    // context: authenticateToken as any
   
  }
));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}


app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
  console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
});
}


startApolloServer();


