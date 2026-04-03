import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoticeResolver } from './notice.resolver';
import { NoticeService } from './notice.service';
import NoticeSchema from '../../schemas/Notice.model';
import { MemberModule } from '../member/member.module';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Notice',
				schema: NoticeSchema,
			},
		]),
		MemberModule,
		AuthModule,
	],
	providers: [NoticeResolver, NoticeService],
})
export class NoticeModule {}
