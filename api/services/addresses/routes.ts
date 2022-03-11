import express from 'express';
import jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export const addressRouter = express.Router();

/** GET /api/addresses */
addressRouter.route('/:projectId').get(jwt(config), controller.listAddresses);

/** POST /api/addresses */
addressRouter.route('/:projectId').post(jwt(config), controller.addAddress);