import { Schema } from 'mongoose';
import { NoticeCategory, NoticePriority, NoticeStatus, NoticeVisibility } from '../libs/enums/notice.enum';

const NoticeSchema = new Schema(
	{
		noticeCategory: {
			type: String,
			enum: NoticeCategory,
			required: true,
		},

		noticeStatus: {
			type: String,
			enum: NoticeStatus,
			default: NoticeStatus.ACTIVE,
		},

		noticeTitle: {
			type: String,
			required: true,
		},

		noticeContent: {
			type: String,
			required: true,
		},

		noticeVisibility: {
			type: String,
			enum: NoticeVisibility,
			required: true,
		},
		noticePriority: {
			type: String,
			enum: NoticePriority,
			default: NoticePriority.LOW,
		},
		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
	},
	{ timestamps: true, collection: 'notices' },
);

export default NoticeSchema;
