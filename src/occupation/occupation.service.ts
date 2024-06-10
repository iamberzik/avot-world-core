import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class OccupationService {
	constructor(private readonly prisma: PrismaService) {}

	async getAllByStatus(statusId: number) {
		return this.prisma.occupation.findMany({
			where: {
				statusId
			},
			select: {
				titleRu: true,
				titleEn: true,
				titleUz: true
			}
		})
	}

	async getByTitleAndStatus(statusId: number, title: string) {
		return this.prisma.occupation.findFirst({
			where: {
				AND: [
					{
						status: {
							id: statusId
						}
					},
					{
						OR: [
							{
								titleRu: title
							},
							{
								titleEn: title
							},
							{
								titleUz: title
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
