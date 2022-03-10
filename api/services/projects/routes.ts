import express from 'express';
import jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export const userRouter = express.Router();

/** GET /api/projects */
userRouter.route('/').get(controller.listProjects);

/** GET /api/projects/:projectId */
/** Authenticated route */
userRouter.route('/:projectId').get(controller.getProject);

/** POST /api/projects */
userRouter.route('/').post(jwt(config), controller.createProject);

/** PATCH /api/projects/:projectId */
/** Authenticated route */
userRouter.route('/:projectId').patch(jwt(config), controller.patch);
