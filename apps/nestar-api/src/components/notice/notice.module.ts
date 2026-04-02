import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoticeResolver } from './notice.resolver';
import { NoticeService } from './notice.service';
import NoticeSchema from '../../schemas/Notice.model';
import { MemberModule } from '../member/member.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Notice',
				schema: NoticeSchema,
			},
		]),
		MemberModule,
	],
	providers: [NoticeResolver, NoticeService],
})
export class NoticeModule {}
