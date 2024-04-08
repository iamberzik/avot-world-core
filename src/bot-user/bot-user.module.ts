import { Module } from '@nestjs/common'
import { BotUserService } from './bot-user.service'
import { BotUserController } from './bot-user.controller'
import { PrismaService } from '../prisma.service'
import { StatusService } from '../status/status.service'
import { OccupationService } from '../occupation/occupation.service'

@Module({
	controllers: [BotUserController],
	providers: [BotUserService, PrismaService, StatusService, OccupationService]
})
export class BotUserModule {}
