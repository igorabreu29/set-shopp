import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Env } from '.'

@Injectable()
export class EnvService {
	constructor(
		@Inject(forwardRef(() => ConfigService))
		private configService: ConfigService<Env, true>
	) {}

	get<T extends keyof Env>(key: T) {
		return this.configService.get(key, { infer: true })
	}
}
