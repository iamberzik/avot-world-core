import { Controller, Get, Param } from '@nestjs/common'
import { OccupationService } from './occupation.service'

@Controller('occupation')
export class OccupationController {
	constructor(private readonly occupationService: OccupationService) {}

	@Get('by-status/:statusId')
	getAllByStatusId(@Param('statusId') statusId: string) {
		return this.occupationService.getAllByStatus(+statusId)
	}
}
