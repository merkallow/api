import os from 'os';
import path from 'path';
import { INTEGER, Sequelize, STRING } from 'sequelize';

import { User } from './models';

// devjutsu test base
// const DATABASE_URL='ov36x80yv0lp.eu-west-2.psdb.cloud';
// var user = 'xou9xmu6cf8c';
// var pass = 'pscale_pw_bof3I3YYIUabu7mbkrkOakEE6aAP6KWJ4NVQU7T4-3g';

const DATABASE_URL='qajpbwcopx9h.eu-west-3.psdb.cloud';
var user = '2blfy0r2pnpr';
var pass = 'pscale_pw_KWzGVacsYK6JwzDQZkL4nVz1cTXuro3Q7DIXkFrOTPE';
// DATABASE_URL='mysql://2blfy0r2pnpr:pscale_pw_KWzGVacsYK6JwzDQZkL4nVz1cTXuro3Q7DIXkFrOTPE@qajpbwcopx9h.eu-west-3.psdb.cloud/testdb?ssl={"rejectUnauthorized":true}'



const sequelize = new Sequelize('testdb', user, pass, {
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
