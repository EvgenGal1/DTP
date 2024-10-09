import { NestFactory } from '@nestjs/core'
import { config } from 'dotenv'

import { AppModule } from './app.module'
// константы > команды запуска process.env.NODE_ENV
import { isProduction, isDevelopment } from './common/envs/env.consts.js'

// загр.перем.окруж.от кмд.NODE_ENV
if (isDevelopment) config({ path: '.env.development' })
else if (isProduction) config({ path: '.env.production' })

async function bootstrap() {
	// созд.экзепл.прилож пока без передачи настр.
	const app = await NestFactory.create(AppModule)

	// PORT Запуска SRV
	const PORT: number = isProduction
		? +process.env.DB_SB_PORT || 3000
		: +process.env.LH_SRV_PORT || 3000

	// прослуш.PORT и fn()callback с cg на Запуск
	await app.listen(PORT, () => {
		// ^ вывод подкл.к БД от NODE_ENV. PROD (БД покаНЕТ) <> DEV (Local БД DTP)
		let mod: string, db: string, srv: string
		if (isProduction) {
			mod = 'PROD'
			db = process.env.DB_SB_PORT
			srv = process.env.SRV_VL_URL
		} else if (isDevelopment) {
			mod = 'DEV'
			db = `${process.env.LH_DB_NAME}_${process.env.LH_DB_USER}:${process.env.LH_DB_PORT}`
			srv = `${process.env.LH_SRV_URL + process.env.LH_SRV_PORT}`
		}
		console.log(`${mod}.  SRV: ${srv}  БД: ${db}`)
	})
}
bootstrap()
