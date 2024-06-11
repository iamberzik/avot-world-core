import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class BotService {
	constructor(private readonly prisma: PrismaService) {}

	async getBotById(botId: string) {
		return this.prisma.bot.findUnique({
			where: {
				telegramId: botId
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

	getOwnedBots(userId: number) {
		return this.prisma.bot.findMany({
			where: {
				ownerId: userId
			}
		})
	}

	async getBotStatByIdAndQuery(botId: string, dto: any) {
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

		const { filterStartDate, filterEndDate } = this.getLimitData(
			dto.from,
			dto.to
		)

		const dataWithDates = this.prepareData(users, requests, filterEndDate)
		const output = this.filterOutput(
			dataWithDates,
			filterStartDate,
			filterEndDate
		)

		return output
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

	prepareData(users, requests, endDate) {
		const dates = this.getDatesArray(
			users[0].createdAt,
			this.compareDates(users[users.length - 1].createdAt, endDate)
		)

		let requestGroups = this.groupByDate(requests)
		let usersGroups = this.groupByDate(users)
		let numberOfUsers = 0
		let numberOfRequests = 0

		let output = {}

		let moment = require('moment')

		for (let i = 0; i < dates.length; i++) {
			const key = moment(dates[i]).format('YYYY-MM-DD')
			if (key in requestGroups) {
				numberOfRequests += requestGroups[key].length
			}

			if (key in usersGroups) {
				numberOfUsers += usersGroups[key].length
			}

			output[key] = {
				users: numberOfUsers,
				requests: numberOfRequests
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
}
