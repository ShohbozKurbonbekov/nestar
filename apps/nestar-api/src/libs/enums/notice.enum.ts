import { registerEnumType } from '@nestjs/graphql';

export enum NoticeCategory {
	GENERAL = 'GENERAL',
	ANNOUNCEMENT = 'ANNOUNCEMENT',
	UPDATE = 'UPDATE',
	EVENT = 'EVENT',
}

registerEnumType(NoticeCategory, {
	name: 'NoticeCategory',
});

export enum NoticeVisibility {
	PUBLIC = 'PUBLIC',
	AGENT = 'AGENT',
	ADMIN = 'ADMIN',
}

export enum NoticePriority {
	HIGH = 'HIGH',
	MEDIUM = 'MEDIUM',
	LOW = 'LOW',
}
registerEnumType(NoticePriority, {
	name: 'NoticePriority',
});
registerEnumType(NoticeVisibility, {
	name: 'NoticeVisibility',
});
export enum NoticeStatus {
	HOLD = 'HOLD',
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}
registerEnumType(NoticeStatus, {
	name: 'NoticeStatus',
});
