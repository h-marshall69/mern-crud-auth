import express, { json } from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

import authRoutes from './routes/auth.routes.js';
import taskRoutes from "./routes/task.routes.js";
const app = express();


app.use(morgan('dev'));
app.use(json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', taskRoutes);

export default app;