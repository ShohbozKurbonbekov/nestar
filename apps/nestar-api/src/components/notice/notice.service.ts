import { BadRequestException, Injectable } from '@nestjs/common';
import { Notice } from '../../libs/dto/notice/notice';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NoticeInput } from '../../libs/dto/notice/notice.input';
import { MemberService } from '../member/member.service';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Message } from '../../libs/enums/common.enum';

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
}
