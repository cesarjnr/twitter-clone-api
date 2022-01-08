import { join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { makeExecutableSchema } from '@graphql-tools/schema';

import resolvers from './resolvers';

const graphQlFileNames = readdirSync(join(__dirname, './typedefs'));
let typeDefs = '';

graphQlFileNames.forEach(fileName => {
  typeDefs += readFileSync(
    join(__dirname, './typedefs', fileName),
    { encoding: 'utf-8' }
  );
});

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
