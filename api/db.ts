import os from 'os';
import path from 'path';
import { INTEGER, Sequelize, STRING } from 'sequelize';

import { User } from './models';

const DATABASE_URL='ov36x80yv0lp.eu-west-2.psdb.cloud';
var user = 'xou9xmu6cf8c';
var pass = 'pscale_pw_bof3I3YYIUabu7mbkrkOakEE6aAP6KWJ4NVQU7T4-3g';

const sequelize = new Sequelize('firstsampl', user, pass, {
	host: DATABASE_URL,
	dialect: 'mysql',
	// storage: path.join(os.tmpdir(), 'db.mysql'),
	// logging: false,
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
