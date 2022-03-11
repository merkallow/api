import express from 'express';

import { authRouter } from './auth';
import { userRouter } from './users';
import { projRouter } from './projects';
import { addressRouter } from './addresses';

export const services = express.Router();

services.use('/auth', authRouter);
services.use('/users', userRouter);
services.use('/projects', projRouter);
services.use('/addresses', addressRouter);
