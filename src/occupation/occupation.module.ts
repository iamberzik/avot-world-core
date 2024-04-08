import { Module } from '@nestjs/common'
import { OccupationService } from './occupation.service'
import { OccupationController } from './occupation.controller'
import { PrismaService } from '../prisma.service'

@Module({
	controllers: [OccupationController],
	providers: [OccupationService, PrismaService],
	exports: [OccupationService]
})
export class OccupationModule {}
