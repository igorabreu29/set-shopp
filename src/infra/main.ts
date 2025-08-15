import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

export async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const configService = app.get(EnvService)
	const PORT = configService.get('PORT')

	await app.listen(PORT)
}
bootstrap()
