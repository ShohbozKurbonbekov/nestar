import { Schema } from 'mongoose';
import { ChatGroupType, ChatMessageStatus, ChatMessageType } from '../libs/enums/chat.enum';

const ChatMessageSchema = new Schema(
	{
		conversationId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Conversation',
		},

		chatGroupType: {
			type: String,
			enum: ChatGroupType,
			required: true,
		},

		senderId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'members',
		},

		receiverId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'members',
		},

		message: {
			type: String,
			required: true,
		},

		isRead: {
			type: Boolean,
			default: false,
		},
		messageStatus: {
			type: String,
			enum: ChatMessageStatus,
			default: ChatMessageStatus.ACTIVE,
		},
		messageType: {
			type: String,
			enum: ChatMessageType,
			required: true,
		},
	},
	{ timestamps: true, collection: 'chatMessage' },
);

export default ChatMessageSchema;
