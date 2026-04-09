import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import ChatMessageSchema from 'apps/nestar-api/src/schemas/ChatMessage.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'chatMessage',
				schema: ChatMessageSchema,
			},
		]),
	],
	providers: [MessageService],
	exports: [MessageService],
})
export class MessageModule {}
