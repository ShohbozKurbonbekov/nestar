import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { MongooseModule } from '@nestjs/mongoose';
import ConversationSchema from 'apps/nestar-api/src/schemas/Conversation.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Conversation',
				schema: ConversationSchema,
			},
		]),
	],
	providers: [ConversationService],
	exports: [ConversationService],
})
export class ConversationModule {}
