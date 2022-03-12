import express from 'express';
import jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export const addressRouter = express.Router();

/** GET /api/addresses */
addressRouter.route('/:projectId').get(jwt(config), controller.get);

/** POST /api/addresses */
addressRouter.route('/:projectId').post(jwt(config), controller.add);

/** Put /api/addresses */
addressRouter.route('/:addressId').put(jwt(config), controller.update);

/** Put /api/addresses */
addressRouter.route('/:addressId').delete(jwt(config), controller.del);
