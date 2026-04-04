import { Schema } from 'mongoose';

const PropertyMessageSchema = new Schema(
	{
		conversationId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'propertyConversations',
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
	},
	{ timestamps: true, collection: 'propertyMessages' },
);

export default PropertyMessageSchema;
