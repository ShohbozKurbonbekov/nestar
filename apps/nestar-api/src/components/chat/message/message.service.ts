import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import Errors, { HttpCode, Message } from '../../../libs/Errors';
import { ChatMessage, Messages, MessagesInput } from '../../../libs/types/message';
import { T } from '../../../libs/types/common';

@Injectable()
export class MessageService {
	constructor(@InjectModel('chatMessage') private readonly chatMessageModel: Model<any>) {}

	async createMessage(data: { userId: ObjectId; message: string }): Promise<ChatMessage> {
		try {
			const newMessage = await this.chatMessageModel.create(data);

			return newMessage;
		} catch (error) {
			throw new Errors(HttpCode.BAD_REQUEST, Message.CREATING_FAILED);
		}
	}

	async getMessages({ before, limit = 20 }: MessagesInput): Promise<Messages> {
		const query: T = {};

		if (before) {
			query.createdAt = { $lt: new Date(before) };
		}

		const sort: T = { createdAt: -1 };

		const result = await this.chatMessageModel
			.find(query)
			.sort(sort)
			.limit(limit + 1);

		const hasMore = result.length > limit;

		if (hasMore) result.pop();
		return { messages: result.reverse(), hasMore };
	}
}
