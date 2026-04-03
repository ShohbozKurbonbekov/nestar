import { Field, InputType, Int } from '@nestjs/graphql';
import { NoticeCategory, NoticePriority, NoticeSort, NoticeStatus, NoticeVisibility } from '../../enums/notice.enum';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { Optional } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { Direction } from '../../enums/common.enum';

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

@InputType()
export class ALNISearchInput {
	@IsOptional()
	@Field(() => String, { nullable: true })
	noticeTitle?: string;

	@IsOptional()
	@Field(() => NoticeCategory, { nullable: true })
	noticeCategory?: NoticeCategory;

	@IsOptional()
	@Field(() => NoticeVisibility, { nullable: true })
	noticeVisibility?: NoticeVisibility;

	@IsOptional()
	@Field(() => NoticeStatus, { nullable: true })
	noticeStatus?: NoticeStatus;
}

@InputType()
export class NoticesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn([...Object.keys(NoticeSort)])
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => ALNISearchInput)
	search: ALNISearchInput;
}
