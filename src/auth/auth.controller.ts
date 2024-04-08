import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { PublicRoute } from './decorators/public.decorator'
import { RegisterDto } from './dto/register-dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@PublicRoute()
	async login(@Body() dto: AuthDto) {
		return this.authService.signIn(dto)
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
