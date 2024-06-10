import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { PublicRoute } from './decorators/public.decorator'
import { RegisterDto } from './dto/register-dto'
import { CurrentUser } from './decorators/user.decorator'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@PublicRoute()
	async login(@Body() dto: AuthDto) {
		return this.authService.signIn(dto)
	}

	@Get('get-me')
	async getMe(@CurrentUser('id') userId: string | number) {
		return this.authService.getMe(+userId)
	}

	@Post('login/access-token')
	@PublicRoute()
	async getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.authService.getNewTokens(dto)
	}

	@Post('register')
	@PublicRoute()
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto)
	}
}
