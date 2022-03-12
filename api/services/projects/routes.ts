import express from 'express';
import jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export const projRouter = express.Router();

/** GET /api/projects */
projRouter.route('/').get(jwt(config), controller.listProjects);

/** GET /api/projects/:projectId */
/** Authenticated route */
projRouter.route('/:projectId').get(controller.getProject);

/** POST /api/projects */
projRouter.route('/').post(jwt(config), controller.createProject);

/** POST /api/projects/generate */
projRouter.route('/generate/:projectId').post(jwt(config), controller.generateTree)