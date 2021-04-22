import { app } from './loaders';

const startServer = async () => {
  app.get('/', (request, reply) => {
    reply.send({ hello: 'world' });
  });

  try {
    await app.listen(3000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
