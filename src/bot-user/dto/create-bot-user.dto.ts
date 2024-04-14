import { Language } from '@prisma/client'

export class CreateBotUserDto {
	botId: string
	userId: string
	additional: any
	language?: Language
}
