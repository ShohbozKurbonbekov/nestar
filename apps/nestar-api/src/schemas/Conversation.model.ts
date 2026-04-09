import { Schema } from 'mongoose';
import { ConversationGroupType, ConversationStatus } from '../libs/enums/conversation.enum';

const ConversationSchema = new Schema(
	{
		targetId: {
			type: Schema.Types.ObjectId,
		},
		conversationStatus: {
			type: String,
			enum: ConversationStatus,
			default: ConversationStatus.ACTIVE,
		},
		conversationGroupType: {
			type: String,
			enum: ConversationGroupType,
			required: true,
		},

		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'members',
		},

		targetOwnerId: {
			type: Schema.Types.ObjectId,
			ref: 'members',
		},

		lastMessage: {
			type: String,
		},

		lastMessageAt: {
			type: Date,
			default: Date.now,
		},

		userUnreadCount: {
			type: Number,
			default: 0,
		},
		targetOwnerUnreadCount: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true, collection: 'Conversation' },
);

ConversationSchema.index({
	userId: 1,
	targetId: 1,
	conversationGroupType: 1,
});

export default ConversationSchema;
