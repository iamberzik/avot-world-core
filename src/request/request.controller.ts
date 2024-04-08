import { Body, Controller, Post } from '@nestjs/common'
import { RequestService } from './request.service'
import { CreateRequestDto } from './dto/create-request.dto'

@Controller('request')
export class RequestController {
	constructor(private readonly requestService: RequestService) {}

	@Post()
	create(@Body() dto: CreateRequestDto) {
		return this.requestService.create(dto)
	}
}
