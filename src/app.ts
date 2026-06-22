import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes/index';
import { apiLimiter } from './middleware/rateLimiter';

const app: Application = express();

app.use('/api', apiLimiter);
app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', poruka: 'Express & TS Backend je spreman!' });
});
app.use('/api', apiRoutes);

export default app;