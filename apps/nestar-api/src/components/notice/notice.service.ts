import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NoticeInput, NoticesInquiry } from '../../libs/dto/notice/notice.input';
import { MemberService } from '../member/member.service';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { NoticeSort } from '../../libs/enums/notice.enum';

@Injectable()
export class NoticeService {
	constructor(
		@InjectModel('Notice') private readonly noticeModel: Model<Notice>,
		private readonly memberService: MemberService,
	) {}

	public async createNotice(input: NoticeInput): Promise<Notice> {
		try {
			const result = await this.noticeModel.create(input);

			await this.memberService.memberStatusEditor({
				_id: shapeIntoMongoObjectId(result.memberId),
				targetKey: 'memberNotices',
				modifier: 1,
			});

			return result;
		} catch (error) {
			console.log('Error', 'createNotice:Service:model: ', error);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getNoticesByAdmin(input: NoticesInquiry): Promise<Notices> {
		const standartSorting: Record<string, string> = {
			[NoticeSort.NEWEST]: 'createdAt',
			[NoticeSort.UPDATED]: 'updatedAt',
			[NoticeSort.OLDEST]: 'createdAt',
		};
		const { noticeCategory, noticeStatus, noticeTitle, noticeVisibility } = input.search;
		const match: T = {};
		const sort: T = {
			[standartSorting[input?.sort] ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};
		if (noticeStatus) match.noticeStatus = noticeStatus;
		if (noticeCategory) match.noticeCategory = noticeCategory;
		if (noticeVisibility) match.noticeVisibility = noticeVisibility;
		if (noticeTitle) match.noticeTitle = { $regex: new RegExp(noticeTitle.trim(), 'i') };
		const result = await this.noticeModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],

						metaCounter: [
							{
								$count: 'total',
							},
						],
					},
				},
			])
			.exec();

		if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}
}
