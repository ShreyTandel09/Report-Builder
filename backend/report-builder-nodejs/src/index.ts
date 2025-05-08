import express from 'express';
// Handle import correctly with ES modules
// @ts-ignore - ignore TypeScript error if any
import models from './models';
const { sequelize } = models;

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.send('🚀 Hello from TypeScript + Express!');
});

// This might not be needed since we have a similar listen call below
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

if (require.main === module) {
  const PORT = process.env.PORT || 8000;

  const startServer = async () => {
      try {
          // Add more logging to debug
          console.log('Sequelize instance type:', typeof sequelize);
          console.log('Sequelize authenticate method exists:', typeof sequelize?.authenticate === 'function');
          
          await sequelize.authenticate();
          console.log('Database connected successfully');

          app.listen(PORT, () => {
              console.log(`Server is running on port ${PORT}`);
              // console.log(`Swagger Documentation: http://localhost:${PORT}/api-docs`);
          });
      } catch (error) {
          console.error('Server startup failed', { error });
          process.exit(1);
      }
  };

  startServer();
}