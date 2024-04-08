import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { TemplateType } from '@prisma/client'

@Injectable()
export class TemplateService {
	constructor(private readonly prisma: PrismaService) {}

	async findAllStaticByBotId(botId: string) {
		return this.prisma.template.findMany({
			where: {
				AND: [
					{
						botId
					},
					{
						type: TemplateType.STATIC
					},
					{
						isActive: true
					}
				]
			},
			select: {
				id: true,
				overlaying: true,
				type: true
			},
			orderBy: {
				id: 'asc'
			}
		})
	}

	async findAllAnimatedByBotId(botId: string) {
		return this.prisma.template.findMany({
			where: {
				AND: [
					{
						botId
					},
					{
						type: TemplateType.ANIMATED
					},
					{
						isActive: true
					}
				]
			},
			select: {
				id: true,
				type: true,
				overlaying: true
			},
			orderBy: {
				id: 'asc'
			}
		})
	}

	findOne(templateId: number) {
		return this.prisma.template.findUnique({
			where: {
				id: templateId
			},
			select: {
				id: true,
				type: true,
				overlaying: true
			}
		})
	}
}
