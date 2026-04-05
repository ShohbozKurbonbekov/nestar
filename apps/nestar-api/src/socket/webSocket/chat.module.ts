import { Module } from '@nestjs/common';
import { PropertyChatService } from './property-chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import PropertyMessageSchema from '../../schemas/PropertyMessage.model';
import { ChatGateway } from './chat.gateway';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'propertyMessages', schema: PropertyMessageSchema }])],
	providers: [ChatGateway, PropertyChatService],
	exports: [ChatGateway],
})
export class ChatModule {}
