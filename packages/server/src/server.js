import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { socketServerConfig } from '##/socketServer/socketServerConfig.js';
import process from 'node:process';
import morgan from 'morgan';
import mongodbConfig from '##/db/mongodbConfig.js';
import requests from '##/api/requests.js';
// process.loadEnvFile(); // Load .env file if exists only from node 21.7.0

const app = express();

dotenv.config({ path: '.env.example' });

app.use(cors());
app.use(express.json());
app.disable('x-powered-by');
app.disable('etag');

app.use(morgan('dev'));

mongodbConfig();

requests(app);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

// Socket configuration
socketServerConfig(3001);

export default app;
