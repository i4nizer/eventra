import * as dotenv from "dotenv"
dotenv.config({ quiet: true })

//

const env = {
	port: Number(process.env.PORT),
	sequelizeUri: process.env.SEQUELIZE_URI,
	sequelizeSync: !!process.env.SEQUELIZE_SYNC,
	sequelizeLogging: !!process.env.SEQUELIZE_LOGGING,
}

//

export default env