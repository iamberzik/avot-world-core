import { Controller, Get, Param } from '@nestjs/common'
import { TemplateService } from './template.service'

@Controller('template')
export class TemplateController {
	constructor(private readonly templateService: TemplateService) {}

	@Get('by-bot/static/:botId')
	findAllStaticByBotId(@Param('botId') botId: string) {
		return this.templateService.findAllStaticByBotId(botId)
	}

	@Get('by-bot/animated/:botId')
	findAllAnimatedByBotId(@Param('botId') botId: string) {
		return this.templateService.findAllAnimatedByBotId(botId)
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.templateService.findOne(+id)
	}
}
