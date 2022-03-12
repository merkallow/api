import { NextFunction, Request, Response } from 'express';
import { where } from 'sequelize/types';
import { resourceLimits } from 'worker_threads';
import { MerkleTree } from 'merkletreejs';
const SHA256 = require('crypto-js/sha256');

import { Project } from '../../models/project.model';
import { Address } from '../../models/address.model';

export const listProjects = (req: Request, res: Response, next: NextFunction) => {
    var userId = (req as any).user.payload.id;
    if(!userId) {
        return res.status(400).json({
            message: 'User id is required',
            data: null
        });
    }

    return Project.findAll({ where: { userId: userId }})
        .then((projects?: Project[]) => {
            res.json(projects);
        });
};

export const getProject = (req: Request, res: Response, next: NextFunction) => {
	var projectId = req.params.projectId;
	if(!projectId) {
        return res.status(400).json({
            message: 'Project id is required',
            data: null
        });
    }

	return Project.findByPk(projectId)
		.then((project: Project | null) => res.json(project))
		.catch(next);
};

export const createProject = async (req: Request<Project>, res: Response, next: NextFunction) => {
    const userId = (req as any).user.payload.id;
	Project.create({name: req.body.name, userId: userId})
		.then((project: Project) => res.json(project))
		.catch(next);
}

export const generateTree = async (req: Request, res: Response, next: NextFunction) => {
    console.log("# Generate");
    const userId = (req as any).user.payload.id;
    var projectId = req.params.projectId;
	if(!projectId) {
        return res.status(400).json({
            message: 'Project id is required',
            data: null
        });
    }
	
    Address.findAll({where: {projectId: 1}})
        .then(addrs => res.json(generate(addrs)))
        .catch(next);
}

function generate(addresslist : Address[]) {
    const addresses = addresslist.map((addr: Address) => { return addr.publicAddress; });
    
    const leaves = addresses.map(x => SHA256(x));
    const tree = new MerkleTree(leaves, SHA256);
    const root = tree.getRoot().toString('hex');
    const leaf = SHA256(addresses[0]);
    const proof = tree.getHexProof(leaf);

    console.log();
    console.log("# root: " + root);
    console.log("# leaf: " + leaf);
    console.log();
    console.log(tree.toString());
    console.log();
    //console.log(tree.verify(proof, leaf, root));
    console.log("# proof:");
    proof.forEach(element => {
        console.log("###> " + JSON.stringify(element));
    });
    
    return root;
}