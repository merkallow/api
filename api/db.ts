import os from 'os';
import path from 'path';
import { INTEGER, Sequelize, STRING } from 'sequelize';

import { User } from './models';

const DATABASE_URL='qajpbwcopx9h.eu-west-3.psdb.cloud';
var user = '';
var pass = '';

const sequelize = new Sequelize('testdb', user, pass, {
	host: DATABASE_URL,
	dialect: 'mysql',
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

// Create new tables
sequelize.sync();

export { sequelize };
