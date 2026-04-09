import { ConversationGroupType, ConversationStatus } from '../enums/conversation.enum';

export interface ChatJoinData {
	targetId: string;
	targetOwnerId: string;
	roomType: ConversationGroupType;
}

export interface Conversation {
	_id: string;
	targetId?: string;
	conversationStatus: ConversationStatus;
	conversationGroupType: ConversationGroupType;
	userId: string;
	targetOwnerId?: string;
	lastMessage?: string;
	lastMessageAt?: Date;
	userUnreadCount: number;
	targetOwnerUnreadCount: number;
	createdAt: Date;
	updatedAt: Date;
}
