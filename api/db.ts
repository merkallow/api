import os from 'os';
import path from 'path';
require('dotenv').config();

// import mysql2 from 'serverless-mysql'; //'mysql2';
import { INTEGER, Sequelize, STRING } from 'sequelize';

import { User, Project, Address } from './models';

const DATABASE_URL=process.env.db_url;
var user = process.env.user;
var pass = process.env.pass;

const sequelize = new Sequelize('testdb', user, pass, {
	host: DATABASE_URL,
	dialect: 'mysql',
    // dialectModule: mysql,
	"ssl": true,
	"dialectOptions": {
		"ssl": {"rejectUnauthorized":true}
	}
});


// Init all models
User.init(
	{
		nonce: {
			allowNull: false,
			type: INTEGER.UNSIGNED, // SQLITE will use INTEGER
			defaultValue: (): number => Math.floor(Math.random() * 10000), // Initialize with a random nonce
		},
		publicAddress: {
			allowNull: false,
			type: STRING,
			unique: true,
			validate: { isLowercase: true },
		},
		username: {
			type: STRING,
			unique: true,
		},
	},
	{
		modelName: 'user',
		sequelize, // This bit is important
		timestamps: false,
	}
);

Project.init(
	{
		name: {
			allowNull: false,
			type: STRING,
			validate: { isLowercase: true },
			unique: true,
		},
		userId: {
			allowNull: false,
			type: INTEGER.UNSIGNED,
			unique: false,
		},
	},
	{
		modelName: 'project',
		sequelize,
		timestamps: false,
	}
);

Address.init(
	{
		publicAddress: {
			allowNull: false,
			type: STRING,
			validate: { isLowercase: true },
		},
		projectId: {
			allowNull: false,
			type: INTEGER.UNSIGNED,
			unique: false,
		},
	},
	{
		modelName: 'address',
		sequelize,
		timestamps: false,
	}
);

// Create new tables
sequelize.sync();

export { sequelize };
