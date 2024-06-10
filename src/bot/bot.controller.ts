import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { BotService } from './bot.service'
import { PublicRoute } from '../auth/decorators/public.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'

@Controller('bot')
export class BotController {
	constructor(private readonly botService: BotService) {}

	@Get('public')
	@PublicRoute()
	getPublicBots() {
		return this.botService.getPublicBots()
	}

	@Get('owned')
	getOwnedBots(@CurrentUser('id') userId: string | number) {
		return this.botService.getOwnedBots(+userId)
	}

	@Get(':botId')
	getBotById(@Param('botId') botId: string) {
		return this.botService.getBotById(botId)
	}

	@Post(':botId/stat')
	getBotStatByIdAndQuery(@Param('botId') botId: string, @Body() dto: any) {
		return this.botService.getBotStatByIdAndQuery(botId, dto)
	}
}
