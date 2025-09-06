const startServer = require('./app');

startServer().then((app) => {
  app.listen(4000, () => {
    console.log('🚀 Server running at http://localhost:4000/graphql');
  });
});
