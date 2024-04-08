import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PrismaService } from '../prisma.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import * as process from 'process'

@Module({
	imports: [
		ConfigModule,
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '60s' }
		})
	],
	controllers: [AuthController],
	providers: [AuthService, PrismaService]
})
export class AuthModule {}
