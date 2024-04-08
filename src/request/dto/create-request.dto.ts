import { RequestType } from '@prisma/client'

export class CreateRequestDto {
	userId: string
	templateId: number
	templateOverlay: RequestType
	occupationId: number
	botId: string
}
