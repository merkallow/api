import { NextFunction, Request, Response } from 'express';
import { where } from 'sequelize/types';
import { resourceLimits } from 'worker_threads';
import { MerkleTree } from 'merkletreejs';
const SHA256 = require('crypto-js/sha256');
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
	
    Address.findAll({where: {projectId: 1}})
        .then(addrs => res.json(generate(addrs)))
        .catch(next);
}

async function generate(addresslist : Address[]) {
    const addresses = addresslist.map((addr: Address) => { return addr.publicAddress; });
    
    const leaves = addresses.map(x => SHA256(x).toString());
    const tree = new MerkleTree(leaves, SHA256);
    const root = tree.getRoot().toString('hex');
    console.log("root: " + root);

    console.log();

    const content = {"root" : root, "address_hash": leaves};
    const cid = await uploadIpfs(JSON.stringify(content), root).then((c) => {
        console.log(">< generated? " + c);
    });

    return root;
}

async function uploadProof(addr: string, tree: MerkleTree, root: string) {
    const leaf = SHA256(addr).toString();
    const proof = tree.getHexProof(leaf);
    const result = proof.map((p) => p.substring(2)).join("");
    console.log("> uploading " + addr + " : " + leaf + " > " + result);

    const pf : Proof = {
        root: root,
        leaf: leaf,
        proof: result
    }
    // console.log(JSON.stringify(pf, undefined, 2));
}

async function uploadIpfs(addresses : string, root: string) {
    const nftstorage = new NFTStorage({ token: process.env.nftkey })

    var file = new File([addresses], "merkles.txt", {
        type: "text/plain",
      });

    return await nftstorage.storeBlob(file);
}