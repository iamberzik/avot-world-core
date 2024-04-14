import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AppLoggerMiddleware } from './middleware/RequestLoggerMiddleware'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaService } from './prisma.service'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth/guards/auth.guard'
import { RolesGuard } from './auth/guards/roles.guard'
import { AuthModule } from './auth/auth.module'
import { BotModule } from './bot/bot.module'
import { BotUserModule } from './bot-user/bot-user.module'
import { StatusModule } from './status/status.module'
import { OccupationModule } from './occupation/occupation.module'
import { TemplateModule } from './template/template.module'
import { RequestModule } from './request/request.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 1000
			}
		]),
		AuthModule,
		BotModule,
		BotUserModule,
		StatusModule,
		OccupationModule,
		TemplateModule,
		RequestModule
	],
	controllers: [],
	providers: [
		PrismaService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard
		}
	]
})
export class AppModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*')
	}
}
