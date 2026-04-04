import { Schema } from 'mongoose';

const PropertyConversationSchema = new Schema(
	{
		propertyId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'properties',
		},

		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'members',
		},

		agentId: {
			type: Schema.Types.ObjectId,
			required: true,
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
		agentUnreadCount: {
			type: Number,
			default: 0,
		},

		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true, collection: 'propertyConversations' },
);

export default PropertyConversationSchema;
