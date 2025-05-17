import express from 'express';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import characterRoutes from './routes/characterRoutes.js';
import episodeRoutes from './routes/episodeRoutes.js';

import logger from './utils/logger.js';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/episodes', episodeRoutes);

app.listen(3000, () => {
    logger.info('Server running at http://localhost:3000');
});
