import { NextFunction, Request, Response } from 'express';
import { where } from 'sequelize/types';
import { resourceLimits } from 'worker_threads';

import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';

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
	
	if(req.params == null) {
		return res.json([]);
	}

	return Project.findByPk(req.params.projectId)
		.then((project: Project | null) => res.json(project))
		.catch(next);
};

export const createProject = (req: Request<Project>, res: Response, next: NextFunction) => {
    var userId = (req as any).user.payload.id;

	var testProj = new Project({id: 1, name: 'hz', 'userId': 1});
	throw new Error("not yet implemented");

	//Project.create(req.body)
		// .then((project: Project) => res.json(project))
		// .catch(next);
}