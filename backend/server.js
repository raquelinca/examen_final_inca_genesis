const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Sincronizar DB y levantar servidor
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
  console.log('✅ Database synced');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Unable to connect to database:', err);
});
