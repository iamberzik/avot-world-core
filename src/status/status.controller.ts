import { Controller, Get, Param } from '@nestjs/common'
import { StatusService } from './status.service'

@Controller('status')
export class StatusController {
	constructor(private readonly statusService: StatusService) {}

	@Get('by-bot/:botId')
	getAllByBotId(@Param('botId') botId: string) {
		return this.statusService.getAllByBotId(botId)
	}
}
