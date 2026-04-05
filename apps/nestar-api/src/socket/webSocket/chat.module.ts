import { Module } from '@nestjs/common';
import { PropertyChatService } from './property-chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import ChatMessageSchema from '../../schemas/ChatMessage.model';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'ChatMessage', schema: ChatMessageSchema }])],
	providers: [ChatGateway, PropertyChatService],
	exports: [ChatGateway],
})
export class ChatModule {}
