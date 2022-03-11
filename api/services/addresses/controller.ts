import { NextFunction, Request, Response } from 'express';
import { where } from 'sequelize/types';
import { resourceLimits } from 'worker_threads';

import { Address } from '../../models/address.model';


export const listAddresses = (req: Request, res: Response, next: NextFunction) => {
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

export const addAddress = (req: Request, res: Response, next: NextFunction) => {
    const address = req.body.address;
    var userId = (req as any).user.payload.id;
    var projectId = req.params.projectId;
    console.log(">>> addresses add " + address + " to project " + projectId);
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
    if(!address) {
        return res.status(400).json({
            message: 'Address is required',
            data: null
        });
    }

    Address.create({publicAddress:address, projectId: projectId})
		.then((address: Address) => res.json(address))
		.catch(next);
};

export const addBulk = (req: Request, res: Response, next: NextFunction) => {
    console.log(">>> addresses post");
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

    // Address.bulkCreate()
    Address.create({projectId: projectId, publicAddress: req.body.publicAddress})
		.then((address: Address) => res.json(address))
		.catch(next);
};