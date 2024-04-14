import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class BotService {
	constructor(private readonly prisma: PrismaService) {}

	async getBotStat(botId: string) {
		return this.prisma.bot.findUnique({
			where: {
				telegramId: botId
			},
			select: {
				botUsers: true,
				statuses: {
					select: {
						occupations: {
							select: {
								requests: true
							}
						}
					}
				}
			}
		})
	}

	async getPublicBots() {
		return this.prisma.bot.findMany({
			where: {
				isPublic: true
			},
			select: {
				isActive: true,
				title: true,
				telegram: true,
				avatar: true,
				_count: {
					select: {
						botUsers: true
					}
				}
			}
		})
	}
}
