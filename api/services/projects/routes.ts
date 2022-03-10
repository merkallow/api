import express from 'express';
import jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export const userRouter = express.Router();

/** GET /api/projects */
userRouter.route('/').get(controller.find);

/** GET /api/projects/:projectId */
/** Authenticated route */
userRouter.route('/:projectId').get(jwt(config), controller.get);

/** POST /api/projects */
userRouter.route('/').post(controller.create);

/** PATCH /api/projects/:projectId */
/** Authenticated route */
userRouter.route('/:projectId').patch(jwt(config), controller.patch);
