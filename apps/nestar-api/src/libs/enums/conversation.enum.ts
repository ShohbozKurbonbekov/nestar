import { registerEnumType } from '@nestjs/graphql';

export enum ConversationGroupType {
	PUBLIC_AGENT = 'USER_AGENT',
	PUBLIC_ADMIN = 'PUBLIC_ADMIN',
}
registerEnumType(ConversationGroupType, { name: 'ConversationGroupType' });

export enum ConversationStatus {
	DELETE = 'DELETE',
	ACTIVE = 'ACTIVE',
	HOLD = 'HOLD',
}
registerEnumType(ConversationStatus, { name: 'ConversationStatus' });
