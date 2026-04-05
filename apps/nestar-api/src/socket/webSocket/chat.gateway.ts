import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PropertyChatService } from './property-chat.service';

@WebSocketGateway(3006, {
	cors: {
		origin: '*',
	},
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly propertyChatService: PropertyChatService) {}

	private logger = new Logger('ChatGateway');

	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket) {
		this.logger.log(`Client Connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client Disconnected: ${client.id}`);
	}

	@SubscribeMessage('property:joinConversation')
	handleJoinConversation(client: Socket, conversationId: string) {
		client.join(conversationId); // Open a room with that id

		this.logger.log(`Client ${client.id} joined conversation ${conversationId}`);
	}

	@SubscribeMessage(`property:sendMessage`)
	handleSendMessage(client: Socket, data: { conversationId: string; msg: string }) {
		this.server.to(data.conversationId).emit('property:newMessage', data.msg);
	}
}
