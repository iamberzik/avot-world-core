import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UserRole } from '@prisma/client'

@Injectable()
export class BotService {
	constructor(private readonly prisma: PrismaService) {}

	async getBotById(botId: string) {
		const bot = await this.prisma.bot.findUnique({
			where: {
				telegramId: botId
			},
			select: {
				telegramId: true,
				isActive: true,
				title: true,
				telegram: true,
				avatar: true,
				type: true,
				_count: {
					select: {
						botUsers: true,
						statuses: true,
						botTemplates: true
					}
				}
			}
		})

		const requests = await this.prisma.request.count({
			where: {
				template: {
					botId
				}
			}
		})

		return {
			...bot,
			requests
		}
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
				type: true,
				_count: {
					select: {
						botUsers: true
					}
				}
			},
			orderBy: {
				createdAt: 'asc'
			}
		})
	}

	async getOwnedBots(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		})

		if (user.role === UserRole.ADMIN) {
			return this.prisma.bot.findMany()
		} else {
			return this.prisma.bot.findMany({
				where: {
					ownerId: userId
				}
			})
		}
	}

	async getBotUsersStat(botId: string, dto: any) {
		const users = await this.prisma.botUser.findMany({
			where: {
				botId
			},
			select: {
				createdAt: true
			},
			orderBy: {
				createdAt: 'asc'
			}
		})

		return this.getDataOutput(dto, users)
	}

	async getBotRequestsStat(botId: string, dto: any) {
		const requests = await this.prisma.request.findMany({
			where: {
				template: {
					botId
				}
			},
			select: {
				createdAt: true
			},
			orderBy: {
				createdAt: 'asc'
			}
		})

		return this.getDataOutput(dto, requests)
	}

	async getBotTemplatesStat(botId: string, dto: any) {
		const templates = await this.prisma.template.findMany({
			where: {
				botId
			},
			select: {
				id: true,
				title: true
			},
			orderBy: {
				createdAt: 'asc'
			}
		})

		const requests = await this.prisma.request.findMany({
			where: {
				template: {
					title: dto.template.toLowerCase() === 'все' ? undefined : dto.template
				}
			},
			select: {
				createdAt: true
			},
			orderBy: {
				createdAt: 'asc'
			}
		})

		return {
			templates,
			requests: this.getDataOutput(dto, requests)
		}
	}

	async getBotStatusesStat(botId: string, dto: any) {
		const statuses = await this.prisma.status.findMany({
			where: {
				AND: [
					{
						botId
					},
					{}
				]
			},
			select: {
				id: true,
				titleRu: true
			},
			orderBy: {
				createdAt: 'asc'
			}
		})

		const requests = await this.prisma.request.findMany({
			where: {
				occupation: {
					status: {
						titleRu: dto.status.toLowerCase() === 'все' ? undefined : dto.status
					}
				}
			},
			select: {
				createdAt: true
			},
			orderBy: {
				createdAt: 'asc'
			}
		})

		return {
			statuses,
			requests: this.getDataOutput(dto, requests)
		}
	}

	groupByDate(array) {
		let moment = require('moment')

		return array.reduce((group, item) => {
			let date = moment(item.createdAt).format('YYYY-MM-DD')

			if (!group[date]) {
				group[date] = []
			}

			group[date].push(item)

			return group
		}, {})
	}

	getLimitData(startDate, endDate) {
		const todayDate = new Date()
		const weekAgo = new Date()
		weekAgo.setDate(todayDate.getDate() - 6)

		const filterStartDate = startDate ? new Date(startDate) : weekAgo
		const filterEndDate = endDate ? new Date(endDate) : todayDate

		filterStartDate.setDate(filterStartDate.getDate())
		filterStartDate.setHours(0, 0, 0)
		filterEndDate.setDate(filterEndDate.getDate() + 1)
		filterEndDate.setHours(0, 0, 0)

		return { filterEndDate, filterStartDate }
	}

	getDatesArray(startDate, stopDate) {
		startDate = new Date(startDate)
		stopDate = new Date(stopDate)

		let dateArray = []
		let currentDate = startDate
		while (currentDate <= stopDate) {
			dateArray.push(new Date(currentDate))
			currentDate.setDate(currentDate.getDate() + 1)
		}
		return dateArray
	}

	compareDates(first, second) {
		let date1 = new Date(first)
		let date2 = new Date(second)

		if (date1 > date2) {
			return date1
		} else if (date1 < date2) {
			return date2
		} else {
			return date1
		}
	}

	prepareData(data, endDate) {
		const dates = this.getDatesArray(
			data[0].createdAt,
			this.compareDates(data[data.length - 1].createdAt, endDate)
		)

		let groups = this.groupByDate(data)
		let value = 0

		let output = {}

		let moment = require('moment')

		for (let i = 0; i < dates.length; i++) {
			const key = moment(dates[i]).format('YYYY-MM-DD')
			const change = key in groups ? groups[key].length : 0

			value += change

			output[key] = {
				value,
				change
			}
		}

		return output
	}

	filterOutput(output, startDate, endDate) {
		Object.keys(output).map(k => {
			const dateKey = new Date(k)
			if (dateKey > endDate || dateKey < startDate) {
				delete output[k]
			}
		})

		return output
	}

	getDataOutput(dto, data) {
		const { filterStartDate, filterEndDate } = this.getLimitData(
			dto.from,
			dto.to
		)
		const dataWithDates = this.prepareData(data, filterEndDate)

		return this.filterOutput(dataWithDates, filterStartDate, filterEndDate)
	}
}
