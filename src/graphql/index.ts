import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

import config from '../config';
import schema from './schema';

const apolloServer = new ApolloServer({
  schema,
  nodeEnv: config.common.env,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
});

export default apolloServer;
