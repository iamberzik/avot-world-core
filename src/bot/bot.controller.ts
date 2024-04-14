import { Controller, Get, Param } from '@nestjs/common'
import { BotService } from './bot.service'
import { PublicRoute } from '../auth/decorators/public.decorator'

@Controller('bot')
export class BotController {
	constructor(private readonly botService: BotService) {}

	@Get('public')
	@PublicRoute()
	getPublicBots() {
		return this.botService.getPublicBots()
	}

	@Get(':botId')
	getBotStatistics(@Param('botId') botId: string) {
		return this.botService.getBotStat(botId)
	}
}
