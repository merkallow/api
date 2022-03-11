import { NextFunction, Request, Response } from 'express';
import { where } from 'sequelize/types';
import { resourceLimits } from 'worker_threads';

import { Address } from '../../models/address.model';


export const get = (req: Request, res: Response, next: NextFunction) => {
    console.log(">>> addresses get");
    var userId = (req as any).user.payload.id;
    var projectId = req.params.projectId;
    if(!userId) {
        return res.status(400).json({
            message: 'User id is required',
            data: null
        });
    }
    if(!projectId) {
        return res.status(400).json({
            message: 'Project id is required',
            data: null
        });
    }

    return Address.findAll({ where: { projectId: projectId }})
        .then((addresses?: Address[]) => {
            res.json(addresses);
        });
};

export const add = (req: Request, res: Response, next: NextFunction) => {
    const addresses = req.body.addresses;
    var userId = (req as any).user.payload.id;
    var projectId = req.params.projectId;
    console.log(">>> addresses add " + addresses + " to project " + projectId);
    if(!userId) {
        return res.status(400).json({
            message: 'User id is required',
            data: null
        });
    }
    if(!projectId) {
        return res.status(400).json({
            message: 'Project id is required',
            data: null
        });
    }
    if(!addresses) {
        return res.status(400).json({
            message: 'Address is required',
            data: null
        });
    }

    const entries = addresses.map(function(addr: string) {
        return {publicAddress: addr, projectId: projectId};
    });

    return Address.bulkCreate(entries)
		.then((address: Address[]) => res.json(address.length))
		.catch(next);
};