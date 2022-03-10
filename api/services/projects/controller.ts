import { NextFunction, Request, Response } from 'express';

import { Project } from '../../models/project.model';

export const listProjects = (req: Request, res: Response, next: NextFunction) => {
	const whereClause =
		req.query && req.query.userId
			? {
					where: { userId: req.query.userId },
			  }
			: undefined;

	return Project.findAll(whereClause)
		.then((projects: Project[]) => res.json(projects))
		.catch(next);
};

export const getProject = (req: Request, res: Response, next: NextFunction) => {
	return Project.findByPk(req.params.projectId)
		.then((project: Project | null) => res.json(project))
		.catch(next);
};

export const createProject = (req: Request, res: Response, next: NextFunction) => {
    var userId = (req as any).project.payload.id;

    Project.create(req.body)
		.then((project: Project) => res.json(project))
		.catch(next);
}