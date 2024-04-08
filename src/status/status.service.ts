import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class StatusService {
	constructor(private readonly prisma: PrismaService) {}

	async getAllByBotId(botId: string) {
		return this.prisma.status.findMany({
			where: {
				botId
			},
			select: {
				id: true,
				titleRu: true,
				titleEn: true
			}
		})
	}

	async getByTitleAndBot(botId: string, title: string) {
		return this.prisma.status.findFirst({
			where: {
				AND: [
					{
						botId
					},
					{
						OR: [
							{
								titleRu: title
							},
							{
								titleEn: title
							}
						]
					}
				]
			},
			select: {
				id: true
			}
		})
	}
}
