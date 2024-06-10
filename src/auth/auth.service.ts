import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { PrismaService } from '../prisma.service'

import * as argon2 from 'argon2'
import { verify } from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { AuthDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { RegisterDto } from './dto/register-dto'
import { generatePassword } from '../utils/generatePassword'

@Injectable()
export class AuthService {
	private ERROR_MESSAGE = 'Проверьте введённые данные'

	constructor(
		private readonly prisma: PrismaService,
		private readonly jwt: JwtService
	) {}

	async signIn(dto: AuthDto) {
		const user_id = await this.validateUser(dto)

		if (!!dto.botId) {
			await this.verifyBot(user_id, dto.botId)
		}

		return await this.returnDefault(user_id)
	}

	async register(dto: RegisterDto) {
		const isEmailExists = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})

		if (!!isEmailExists) {
			throw new BadRequestException('Email уже занят')
		}

		const password = generatePassword()

		const user = await this.prisma.user.create({
			data: {
				firstName: dto.firstName,
				lastName: dto.lastName,
				patronymic: dto.patronymic || undefined,
				email: dto.email,
				telegram: dto.telegram,
				password: await argon2.hash(password),
				role: undefined
			},
			select: {
				id: true
			}
		})

		return {
			id: user.id,
			password
		}
	}

	async verifyBot(userId: number, botId: string) {
		const bot = await this.prisma.bot.findFirst({
			where: {
				AND: [
					{
						ownerId: userId
					},
					{
						telegramId: botId
					}
				]
			}
		})

		if (!bot || !bot.isActive)
			throw new UnauthorizedException(this.ERROR_MESSAGE)

		return true
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		try {
			const result = await this.jwt.verifyAsync(refreshToken)
			return await this.returnDefault(result.id)
		} catch (e) {
			throw new UnauthorizedException('Неверный токен')
		}
	}

	async getMe(userId: number) {
		return await this.returnDefault(userId)
	}

	private async issueTokens(userId: number, role_slug: string) {
		const data = { id: userId, role: role_slug }

		const accessToken = this.jwt.sign(data, { expiresIn: '1d' })

		const refreshToken = this.jwt.sign(data, { expiresIn: '30d' })

		return { accessToken, refreshToken }
	}

	private async validateUser({ email, password }: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: email
			}
		})

		if (!user || !user.isActive) {
			throw new NotFoundException(this.ERROR_MESSAGE)
		}

		const isPasswordValid = await verify(user.password, password)

		if (!isPasswordValid) throw new UnauthorizedException(this.ERROR_MESSAGE)

		return user.id
	}

	private async returnDefault(user_id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: user_id
			},
			select: {
				id: true,
				role: true,
				email: true,
				firstName: true,
				lastName: true,
				telegram: true
			}
		})

		const tokens = await this.issueTokens(user_id, user.role)

		return {
			user,
			...tokens
		}
	}
}
