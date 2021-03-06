import { NextFunction, Request, Response } from 'express';
import { where } from 'sequelize/types';
import { resourceLimits } from 'worker_threads';
import { MerkleTree } from 'merkletreejs';
const keccak256 = require("keccak256");
import { NFTStorage, File } from 'nft.storage';
import mime from 'mime';
import { Blob } from 'buffer';

import { Project } from '../../models/project.model';
import { Address } from '../../models/address.model';
import { Proof } from '../../models/proof.model';

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

    Project.findByPk(projectId)
		.then((project: Project | null) =>  {if (project.userId != userId) { 
            return res.status(400).json({
                message: 'Must be project owner to generate merkle tree',
                data: null
            });
        }});

	
    Address.findAll({where: {projectId: projectId}})
        .then(addrs => {
            generate(addrs).then(result => {
                console.log("#> " + result);
                return res.json(result);
            });
        })
        .catch(next);
}

async function generate(addresslist : Address[]) {
    const addresses = addresslist.map((addr: Address) => { return addr.publicAddress; });
    const leaves = addresses.map(x => keccak256(x).toString("hex"));
    console.log("addresses: " + addresses);
    console.log("leaves: " + leaves);
    const tree = new MerkleTree(leaves, keccak256, {sortPairs:true});
    const root = tree.getRoot().toString('hex');
    console.log("root: " + root);

    console.log();

    const content = {"root" : root, "address_hash": leaves};
    const result = await uploadIpfs(JSON.stringify(content), root)
            .then((cid) => {
                console.log("> generated " + cid);
                return {
                    "root": root,
                    "cid": cid
                }
            });
    return result;
}

async function uploadIpfs(content : string, root: string) {
    const nftstorage = new NFTStorage({ token: process.env.nftkey })

    var file = new File([content], "merkallow.txt", {
        type: "text/plain",
    });

    return await nftstorage.storeBlob(file);
}