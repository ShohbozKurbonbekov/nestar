import { Field, InputType } from '@nestjs/graphql';
import { NoticeCategory, NoticePriority, NoticeStatus, NoticeVisibility } from '../../enums/notice.enum';
import { IsNotEmpty, Length } from 'class-validator';
import { Optional } from '@nestjs/common';
import { ObjectId } from 'mongoose';

@InputType()
export class NoticeInput {
	@IsNotEmpty()
	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@IsNotEmpty()
	@Length(1, 100)
	@Field(() => String)
	noticeTitle: string;

	@IsNotEmpty()
	@Length(1, 200)
	@Field()
	noticeContent: string;

	@IsNotEmpty()
	@Field(() => NoticeVisibility)
	noticeVisibility: NoticeVisibility;

	@Optional()
	@Field(() => NoticePriority, { nullable: true })
	noticePriority?: NoticePriority;

	memberId: ObjectId;
}
