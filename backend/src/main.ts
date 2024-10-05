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

	// PORT Запуска
	let PORT: number
	if (isDevelopment) PORT = +process.env.PORT
	else if (isProduction) PORT = +process.env.SB_PG_PORT
	else PORT = 3000

	// прослуш.PORT и fn()callback с cg на Запуск
	let url: string
	await app.listen(PORT, () => {
		// ^ вывод подкл.к БД от NODE_ENV. PROD (БД покаНЕТ) <> DEV (Local БД DTP)
		let srt: string, port: string, source: string
		if (isDevelopment) {
			srt = 'DEV'
			source = 'LocalHost'
			port = `${process.env.LH_PG_PORT}(${source})`
			url = process.env.PROTOCOL + process.env.PORT
		} else if (isProduction) {
			srt = 'PROD'
			port = process.env.SB_PG_PORT + '(SupaBase)'
			source = 'VERCEL'
			url = process.env.VERCEL_URL
		}
		console.log(`${srt}. Сервер - ${port}, подключён '${source}' - ${url}`)
	})
}
bootstrap()
