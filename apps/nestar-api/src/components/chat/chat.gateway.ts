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
import { T } from '../../libs/types/common';

@WebSocketGateway(3006, {
	cors: {
		origin: '*',
	},
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly authService: AuthService) {}
	@WebSocketServer()
	server: Server;

	// userId -> socketIds[]
	private onlineUsers = new Map<string, Set<string>>();

	handleConnection(client: Socket) {
		console.log('Client connected:', client.id);
	}

	handleDisconnect(client: Socket) {
		try {
			for (const [userId, sockets] of this.onlineUsers.entries()) {
				if (sockets.has(client.id)) {
					sockets.delete(client.id);

					if (sockets.size === 0) {
						this.onlineUsers.delete(userId);
					}

					this.server.emit('presence:update', {
						userId,
						status: 'offline',
					});
				}
			}

			console.log('Client disconnected:', client.id);
		} catch (error) {
			console.log('Error in handleDisconnect: ', error);
			this.sendError(client, new Errors(HttpCode.BAD_REQUEST, Message.DISCONNECT_ERROR));
		}
	}

	@SubscribeMessage('user:online')
	async handleUserOnline(@MessageBody() token: string, @ConnectedSocket() client: Socket) {
		try {
			const user = await this.authService.verifyToken(token);
			const userId = String(user._id);
			if (!this.onlineUsers.has(userId)) {
				this.onlineUsers.set(userId, new Set());
			}

			this.onlineUsers.get(userId)?.add(client.id);

			this.server.emit('presence:update', { userId, status: Boolean(userId) ? 'online' : 'offline' });
			console.log('User online: ', userId);
		} catch (error) {
			console.log('Error  in handleUserOnline: ', error);
			this.sendError(client, new Errors(HttpCode.BAD_REQUEST, Message.USER_ONLINE_ERROR));
		}
	}

	private sendError(client: Socket, message: { code: HttpCode; message: Message }) {
		client.emit('chat:error', message);
	}

	@SubscribeMessage('user:authenticate')
	async handleAuthenticate(@MessageBody() token: string, @ConnectedSocket() client: Socket) {
		try {
			const user = await this.authService.verifyToken(token);
			const userId = String(user._id);
			if (!this.onlineUsers.has(userId)) {
				this.onlineUsers.set(userId, new Set());
			}

			this.onlineUsers.get(userId)?.add(client.id);
			console.log('User authenticated: ', userId);
			client.emit('presence:update', { userId, status: Boolean(userId) ? 'online' : 'offline' });
		} catch (error) {
			console.log('Error in handleAuthenticate: ', error);
			this.sendError(client, new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED));
		}
	}

	@SubscribeMessage('user:logout')
	async handleLogout(@MessageBody() token: string, @ConnectedSocket() client: Socket) {
		try {
			const user = await this.authService.verifyToken(token);
			const userId = String(user._id);
			const sockets = this.onlineUsers.get(userId);
			if (sockets) {
				sockets.delete(client.id);

				if (sockets.size === 0) {
					this.onlineUsers.delete(userId);
				}
			}

			client.emit('presence:update', { userId, status: 'offline' });
			console.log('User logout: ', userId);
		} catch (error) {
			console.log('Error in handleLogout: ', error);
			this.sendError(client, new Errors(HttpCode.BAD_REQUEST, Message.ERROR_LOGOUT));
		}
	}

	@SubscribeMessage('presence:check')
	handlePresenceCheck(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
		try {
			const isOnline = this.onlineUsers.has(userId);
			client.emit('presence:update', {
				userId,
				status: isOnline ? 'online' : 'offline',
			});
		} catch (error) {
			console.log('Error in handlePresenceCheck: ', error);
			this.sendError(client, new Errors(HttpCode.BAD_REQUEST, Message.PRESENCE_CHECK_FAILED));
		}
	}
}
