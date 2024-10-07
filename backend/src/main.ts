import { NestFactory } from '@nestjs/core'
import { config } from 'dotenv'

import { AppModule } from './app.module'
// константы > команды запуска process.env.NODE_ENV
import { isProduction, isDevelopment } from './common/envs/env.consts.js'

// загр.перем.окруж.от кмд.NODE_ENV
if (isDevelopment) config({ path: '.env.development' })
else if (isProduction) config()

async function bootstrap() {
	// созд.экзепл.прилож пока без передачи настр.
	const app = await NestFactory.create(AppModule)

	// PORT Запуска SRV
	let PORT_SRV: number
	if (isDevelopment) PORT_SRV = +process.env.LH_SRV_PORT
	else if (isProduction) PORT_SRV = +process.env.PRD_SRV_PORT
	else PORT_SRV = 3000

	// прослуш.PORT и fn()callback с cg на Запуск
	// let url: string
	await app.listen(PORT_SRV, () => {
		// ^ вывод подкл.к БД от NODE_ENV. PROD (БД покаНЕТ) <> DEV (Local БД DTP)
		let env: string, port_db: string, srv_url: string
		if (isDevelopment) {
			env = 'DEV'
			port_db = process.env.LH_DB_PORT
			srv_url = `${process.env.LH_SRV_URL + process.env.LH_SRV_PORT}`
		} else if (isProduction) {
			env = 'PROD'
			port_db = process.env.SB_DB_PORT
			srv_url = process.env.VL_SRV_URL
		}
		console.log(`${env}. БД: ${port_db}, SRV: ${srv_url}`)
	})
}
bootstrap()
