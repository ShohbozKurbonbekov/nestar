import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConversationGroupType, ConversationStatus } from 'apps/nestar-api/src/libs/enums/conversation.enum';
import Errors, { HttpCode, Message } from 'apps/nestar-api/src/libs/Errors';
import { ChatJoinData, Conversation } from 'apps/nestar-api/src/libs/types/chat';
import { Model } from 'mongoose';

@Injectable()
export class ConversationService {
	constructor(@InjectModel('Conversation') private readonly conversationModel: Model<Conversation>) {}

	// PUBLIC - AGENT JOIN
	async findOrCreateUserAgentConversation(
		userId: string,
		targetId: string,
		targetOwnerId: string,
		conversationGroupType: ConversationGroupType,
	): Promise<Conversation> {
		try {
			const conversation = await this.conversationModel
				.findOne({
					userId,
					targetId,
					conversationGroupType,
				})
				.lean();

			if (conversation?.conversationStatus === ConversationStatus.HOLD) {
				throw new Errors(HttpCode.BAD_REQUEST, Message.CONVERSATION_BLOCKED);
			}

			if (conversation) return conversation;

			return await this.conversationModel.create({
				userId,
				targetId,
				targetOwnerId,
				conversationGroupType,
			});
		} catch (error) {
			console.log('Error in findOrCreateUserAgentConversation: ', error);
			if (error instanceof Errors) {
				throw error;
			} else {
				throw Errors.standart;
			}
		}
	}
}
