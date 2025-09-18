import * as dotenv from "dotenv"
dotenv.config({ quiet: true })

//

const env = {
	port: Number(process.env.PORT),
	sequelizeUri: process.env.SEQUELIZE_URI,
	sequelizeSync: !!process.env.SEQUELIZE_SYNC,
    sequelizeLogging: !!process.env.SEQUELIZE_LOGGING,
    jwtAccessLife: Number(process.env.JWT_ACCESS_LIFE),
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
}

//

export default env