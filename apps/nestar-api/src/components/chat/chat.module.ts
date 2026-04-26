import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './chat.gateway';

@Module({
	imports: [MessageModule, AuthModule],

	providers: [ChatGateway],
})
export class ChatModule {}
