import { registerEnumType } from '@nestjs/graphql';

export enum ChatGroupType {
	AGENT_PROPERTY = 'AGENT_PROPERTY',
	ADMIN_SUPPORT = 'ADMIN_SUPPORT',
}

registerEnumType(ChatGroupType, { name: 'ChatGroupType' });

export enum ChatMessageStatus {
	DELETE = 'DELETE',
	ACTIVE = 'ACTIVE',
}

registerEnumType(ChatMessageStatus, { name: 'ChatMessageStatus' });

export enum ChatMessageType {
	TEXT = 'TEXT',
	FILE = 'FILE',
	IMAGE = 'IMAGE',
}

registerEnumType(ChatMessageType, { name: 'ChatMessageType' });
