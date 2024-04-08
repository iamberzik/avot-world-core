import { CreateBotUserDto } from './create-bot-user.dto'
import { Language } from '@prisma/client'

export class UpdateBotUserDto extends CreateBotUserDto {
	language?: Language
	occupationTitle?: string
	statusTitle?: string
	statusId?: number
	isFinished?: boolean
}
