import { Module } from '@nestjs/common';
import { BoardArticleResolver } from './board-article.resolver';
import { BoardArticleService } from './board-article.service';
import BoardArticleSchema from '../../schemas/BoardArticle.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { ViewModule } from '../view/view.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'BoardArticle', schema: BoardArticleSchema }]),
		AuthModule,
		MemberModule,
		ViewModule,
	],
	providers: [BoardArticleResolver, BoardArticleService],
	exports: [BoardArticleService],
})
export class BoardArticleModule {}

/*
1) [MongooseModule.forFeature([{ name: 'BoardArticle', schema: BoardArticleSchema }])] - This line registers a Mongoose schema (BoardArticleSchema) with the name BoardArticle into NestJS's dependency injection container, so you can inject the corresponding Mongoose model into your services.
*/
