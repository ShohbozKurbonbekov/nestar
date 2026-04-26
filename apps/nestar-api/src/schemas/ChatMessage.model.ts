import { Schema } from 'mongoose';
import { ChatGroupType, ChatMessageStatus, ChatMessageType } from '../libs/enums/chat.enum';

const ChatMessageSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'members',
		},
		messageStatus: {
			type: String,
			enum: ChatMessageStatus,
			default: ChatMessageStatus.ACTIVE,
		},

		messageReportedBy: {
			type: [Schema.Types.ObjectId],
			default: [],
		},

		message: {
			type: String,
			required: true,
		},
		messageReports: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true, collection: 'chatMessage' },
);

ChatMessageSchema.index({
	messageStatus: 1,
	userId: 1,
});

export default ChatMessageSchema;
