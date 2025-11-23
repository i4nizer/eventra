import * as dotenv from "dotenv"
dotenv.config({ quiet: true })

//

const env = {
	port: Number(process.env.PORT),
	authBypass: !!process.env.AUTH_BYPASS,
	adminName: process.env.ADMIN_NAME,
	adminEmail: process.env.ADMIN_EMAIL,
	adminPassword: process.env.ADMIN_PASSWORD,
	sequelizeRaw: process.env.SEQUELIZE_RAW,
	sequelizeUri: process.env.SEQUELIZE_URI,
	sequelizeName: process.env.SEQUELIZE_NAME,
	sequelizeSync: !!process.env.SEQUELIZE_SYNC,
	sequelizeAlter: !!process.env.SEQUELIZE_ALTER,
	sequelizeForce: !!process.env.SEQUELIZE_FORCE,
	sequelizeLogging: !!process.env.SEQUELIZE_LOGGING,
	jwtAccessLife: Number(process.env.JWT_ACCESS_LIFE),
	jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
}

//

export default env
