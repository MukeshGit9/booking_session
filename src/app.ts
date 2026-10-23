import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import userRoutes from './modules/user/user.route.js';
import teacherRoutes from './modules/teacher/teacher.route.js';
import sessionRoutes from './modules/session/session.route.js';

import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send("assign ment server")
    next()
});

app.use('/api/v1', userRoutes);
app.use('/api/v1', teacherRoutes);
app.use('/api/v1', sessionRoutes);

app.use(errorHandler)



export default app;