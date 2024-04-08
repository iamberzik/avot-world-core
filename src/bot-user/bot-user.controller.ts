import { Body, Controller, Patch, Post } from '@nestjs/common'
import { BotUserService } from './bot-user.service'
import { CreateBotUserDto } from './dto/create-bot-user.dto'
import { UpdateBotUserDto } from './dto/update-bot-user.dto'

@Controller('bot-user')
export class BotUserController {
	constructor(private readonly botUserService: BotUserService) {}

	@Post()
	getOrCreate(@Body() dto: CreateBotUserDto) {
		return this.botUserService.getOrCreate(dto)
	}

	@Patch()
	update(@Body() updateBotUserDto: UpdateBotUserDto) {
		return this.botUserService.update(updateBotUserDto)
	}
}
