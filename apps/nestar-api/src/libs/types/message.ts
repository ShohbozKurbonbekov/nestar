import { ObjectId } from 'mongoose';
import { ChatMessageStatus } from '../enums/chat.enum';

export interface ChatMessage {
	_id?: ObjectId;
	userId: ObjectId;
	messageStatus: ChatMessageStatus;
	messageReportedBy: ObjectId[];
	message: string;
	messageReports: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface MessagesInput {
	before?: string;
	limit?: number;
}

export interface Messages {
	messages: ChatMessage[];
	hasMore: boolean;
}
