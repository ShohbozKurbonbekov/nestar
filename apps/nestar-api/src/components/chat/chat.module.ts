import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './chat.gateway';

@Module({
	imports: [MessageModule, ConversationModule, AuthModule],

	providers: [ChatGateway],
})
export class ChatModule {}
