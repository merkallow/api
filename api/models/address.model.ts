import { Model } from 'sequelize';

export class Address extends Model {
	public id!: number;
    public projectId!: number;
	public publicAddress!: string;
}
