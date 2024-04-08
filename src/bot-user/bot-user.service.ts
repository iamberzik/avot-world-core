import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CreateBotUserDto } from './dto/create-bot-user.dto'
import { UpdateBotUserDto } from './dto/update-bot-user.dto'
import { PrismaService } from '../prisma.service'
import { StatusService } from '../status/status.service'
import { OccupationService } from '../occupation/occupation.service'

@Injectable()
export class BotUserService {
	private ACCESS_DENIED_ERROR = 'Access denied'

	constructor(
		private readonly prisma: PrismaService,
		private readonly statusService: StatusService,
		private readonly occupationService: OccupationService
	) {}

	async getOrCreate(dto: CreateBotUserDto) {
		const user = await this.findUser(dto.userId, dto.botId)

		if (user && !user.isActive) {
			throw new UnauthorizedException(this.ACCESS_DENIED_ERROR)
		}

		if (!user) {
			return this.prisma.botUser.create({
				data: {
					botId: dto.botId,
					telegramId: dto.userId,
					additional: dto.additional || {}
				},
				select: {
					telegramId: true,
					language: true,
					isFinished: true
				}
			})
		}

		return user
	}

	async update(dto: UpdateBotUserDto) {
		const user = await this.findUser(dto.userId, dto.botId)

		if (user && !user.isActive) {
			throw new UnauthorizedException(this.ACCESS_DENIED_ERROR)
		}

		const updateData = {
			statusId: null,
			occupationId: null
		}

		if (dto.statusTitle) {
			const status = await this.statusService.getByTitleAndBot(
				dto.botId,
				dto.statusTitle
			)
			updateData.statusId = status.id
		}

		if (dto.occupationTitle && dto.statusId) {
			const occupation = await this.occupationService.getByTitleAndStatus(
				+dto.statusId,
				dto.occupationTitle
			)
			updateData.occupationId = occupation.id
		}

		await this.prisma.botUser.update({
			where: {
				id: user.id
			},
			data: {
				language: dto.language || undefined,
				isFinished: dto.isFinished || user.isFinished,
				additional: dto.additional,
				occupationId: updateData.occupationId || undefined,
				statusId: updateData.statusId || undefined
			}
		})

		return this.findUser(dto.userId, dto.botId)
	}

	async findUser(userId: string, botId: string) {
		return this.prisma.botUser.findFirst({
			where: {
				AND: [
					{
						telegramId: userId
					},
					{
						botId
					}
				]
			},
			select: {
				id: true,
				telegramId: true,
				language: true,
				isActive: true,
				isFinished: true,
				status: {
					select: {
						id: true,
						code: true,
						titleRu: true,
						titleEn: true
					}
				},
				occupation: {
					select: {
						id: true,
						code: true,
						titleRu: true,
						titleEn: true
					}
				}
			}
		})
	}
}
