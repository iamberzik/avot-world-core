import { Injectable } from '@nestjs/common'
import { CreateRequestDto } from './dto/create-request.dto'
import { PrismaService } from '../prisma.service'

@Injectable()
export class RequestService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateRequestDto) {
		const user = await this.prisma.botUser.findFirst({
			where: {
				AND: [
					{
						botId: dto.botId
					},
					{
						telegramId: dto.userId
					}
				]
			},
			select: {
				id: true
			}
		})

		return this.prisma.request.create({
			data: {
				templateId: dto.templateId,
				botUserId: user.id,
				occupationId: dto.occupationId,
				type: dto.templateOverlay
			}
		})
	}
}
