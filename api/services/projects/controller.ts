import { NextFunction, Request, Response } from 'express';

import { Project } from '../../models/project.model';

export const projectsList = (req: Request, res: Response, next: NextFunction) => {
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

export const get = (req: Request, res: Response, next: NextFunction) => {
	if ((req as any).project.payload.id !== +req.params.projectId) {
		return res
			.status(401)
			.send({ error: 'You can can only access yourself' });
	}
	return Project.findByPk(req.params.projectId)
		.then((project: Project | null) => res.json(project))
		.catch(next);
};

export const create = (req: Request, res: Response, next: NextFunction) =>
Project.create(req.body)
		.then((project: Project) => res.json(project))
		.catch(next);

export const patch = (req: Request, res: Response, next: NextFunction) => {
	// Only allow to fetch current user
	if ((req as any).project.payload.id !== +req.params.projectId) {
		return res
			.status(401)
			.send({ error: 'You can can only access yourself' });
	}
	return Project.findByPk(req.params.projectId)
		.then((project: Project | null) => {
			if (!project) {
				return project;
			}

			Object.assign(project, req.body);
			return project.save();
		})
		.then((project: Project | null) => {
			return project
				? res.json(project)
				: res.status(401).send({
						error: `Project with id ${req.params.projectId} is not found in database`,
				  });
		})
		.catch(next);
};
