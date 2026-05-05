import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import Errors, { HttpCode, Message } from '../../libs/Errors';
import { MessageService } from './message/message.service';
import { Member } from '../../libs/dto/member/member';

@WebSocketGateway(3006, {
	cors: {
		origin: '*',
	},
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly authService: AuthService,
		private readonly messageService: MessageService,
	) {}

	@WebSocketServer()
	server: Server;

	// userId -> socketIds[]
	private onlineUsers = new Map<string, Set<string>>();
	private socketToUser = new Map<string, string>();

	async handleConnection(client: Socket) {
		try {
			const token = client.handshake.auth?.token;

			if (!token) {
				throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
			}

			const user: Member = await this.authService.verifyToken(token);
			const userId = String(user._id);

			client.data.user = user;

			if (!this.onlineUsers.has(userId)) {
				this.onlineUsers.set(userId, new Set());
			}

			this.onlineUsers.get(userId).add(client.id);
			this.socketToUser.set(client.id, userId);

			const isFirstConnection = this.onlineUsers.get(userId).size === 1;

			const { messages, hasMore } = await this.messageService.getMessages({});

			client.emit('chat:init', {
				messages,
				hasMore,
			});

			if (isFirstConnection) {
				this.server.emit('system:join', {
					user: {
						id: userId,
						nick: user.memberNick,
					},
					message: `${user.memberNick} joined the chat`,
				});
				console.log(`${user.memberNick} connected. Total online: ${this.onlineUsers.size}`);
			}
			// ---- BROADCAST PRESENCE UPDATE ----
			this.server.emit('presence:update', {
				totalOnlineUsers: this.onlineUsers.size,
			});
		} catch (error) {
			console.log('Error in handleConnection:', error);

			if (error instanceof Errors) {
				this.sendError(client, { code: error?.code, message: error?.message });
			} else {
				this.sendError(client, {
					code: Errors.standart.code,
					message: Errors.standart.message,
				});
			}

			client.disconnect();
		}
	}

	handleDisconnect(client: Socket) {
		try {
			const userId = this.socketToUser.get(client.id);
			if (!userId) return;

			const sockets = this.onlineUsers.get(userId);
			if (!sockets) return;

			sockets.delete(client.id);

			this.socketToUser.delete(client.id);

			const isFullyDisconnected = sockets.size === 0;

			if (isFullyDisconnected) {
				this.onlineUsers.delete(userId);

				this.server.emit('system:leave', {
					user: { id: userId, nick: client.data.user?.memberNick },
					message: `${client.data.user?.memberNick} left the chat`,
				});

				console.log('Client disconnected:', client.id);
			}

			this.server.emit('presence:update', {
				totalOnlineUsers: this.onlineUsers.size,
			});
		} catch (error) {
			console.log('Error in handleDisconnect: ', error);
			this.sendError(client, new Errors(HttpCode.BAD_REQUEST, Message.DISCONNECT_ERROR));
		}
	}

	private sendError(client: Socket, message: { code: HttpCode; message: Message }) {
		client.emit('chat:error', message);
	}

	@SubscribeMessage('message:send')
	async sendMessage(@MessageBody() body, @ConnectedSocket() client: Socket) {
		try {
			const user = client.data.user;

			const message = await this.messageService.createMessage({
				userId: user._id,
				message: body.message,
			});

			this.server.emit('message:new', message);
		} catch (error) {
			if (error instanceof Errors) {
				this.sendError(client, { code: error.code, message: error.message });
			} else {
				this.sendError(client, { code: Errors.standart.code, message: Errors.standart.message });
			}
		}
	}

	@SubscribeMessage('message:loadMore')
	async loadMore(@MessageBody() body, @ConnectedSocket() client: Socket) {
		try {
			const { before } = body;

			const { messages, hasMore } = await this.messageService.getMessages({ before });

			client.emit('message:older', {
				messages,
				hasMore,
			});
		} catch (error) {
			console.log('Error in loadMore');
			this.sendError(client, { code: HttpCode.BAD_REQUEST, message: Message.MORE_MESSAGES_FAILED });
		}
	}
}
