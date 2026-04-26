import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { shapeIntoMongoObjectId } from 'apps/nestar-api/src/libs/config';
import { ChatMessageStatus } from 'apps/nestar-api/src/libs/enums/chat.enum';
import Errors, { HttpCode, Message } from 'apps/nestar-api/src/libs/Errors';
import { T } from 'apps/nestar-api/src/libs/types/common';
import { ChatMessage, Messages, MessagesInput } from 'apps/nestar-api/src/libs/types/message';
import { Model, ObjectId, Types } from 'mongoose';

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
