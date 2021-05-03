import Application from './app';

const startServer = async (): Promise<void> => {
  const app = new Application();
  const port = process.env.PORT || 3000;

  await app.init();
  app.express.listen(port);
  console.log(`Application started on port ${port}!`);
}

startServer();
