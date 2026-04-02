import { BadRequestException, Injectable, InternalServerErrorException, Search, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { BoardArticle, BoardArticles } from '../../libs/dto/board-article/board-article';
import {
	AllBoardArticlesInquiry,
	BoardArticleInput,
	BoardArticlesInquiry,
} from '../../libs/dto/board-article/board-article.input';
import { MemberService } from '../member/member.service';

import { Direction, Message } from '../../libs/enums/common.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ViewService } from '../view/view.service';
import { StatisticModifiler, T } from '../../libs/types/common';
import { BoardArticleStatus } from '../../libs/enums/board-article.enum';
import { BoardArticleUpdate } from '../../libs/dto/board-article/board-article.update';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Args } from '@nestjs/graphql';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeService } from '../like/like.service';

@Injectable()
export class BoardArticleService {
	constructor(
		@InjectModel('BoardArticle') private readonly boardArticleModel: Model<BoardArticle>,
		private readonly memberService: MemberService,
		private readonly viewService: ViewService,
		private readonly likeService: LikeService,
	) {}

	public async createBoardArticle(memberId: ObjectId, input: BoardArticleInput): Promise<BoardArticle> {
		input.memberId = memberId;

		try {
			const result = await this.boardArticleModel.create(input);

			await this.memberService.memberStatusEditor({
				_id: memberId,
				targetKey: 'memberArticles',
				modifier: 1,
			});

			return result;
		} catch (error) {
			console.log('Error in service.model: ', error.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getBoardArticle(memberId: ObjectId, articleId: ObjectId): Promise<BoardArticle> {
		const search: T = {
			_id: articleId,
			articleStatus: BoardArticleStatus.ACTIVE,
		};

		const targetBoardArticle: BoardArticle = await this.boardArticleModel.findOne(search).lean().exec();
		if (!targetBoardArticle) {
			throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		}

		if (memberId) {
			const viewInput = {
				memberId: memberId,
				viewRefId: articleId,
				viewGroup: ViewGroup.ARTICLE,
			};

			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.boardArticleStatsEditor({
					_id: articleId,
					targetKey: 'articleViews',
					modifier: 1,
				});
				targetBoardArticle.articleViews++;
			}

			const likeInput = { memberId: memberId, likeRefId: articleId, likeGroup: LikeGroup.ARTICLE };

			targetBoardArticle.PropertiesInquiry = await this.likeService.checkLikeExistance(likeInput);
		}

		targetBoardArticle.memberData = await this.memberService.getMember(null, targetBoardArticle.memberId);
		targetBoardArticle.meLiked = targetBoardArticle.PropertiesInquiry;

		return targetBoardArticle;
	}

	public async updateBoardArticle(memberId: ObjectId, input: BoardArticleUpdate): Promise<BoardArticle> {
		const { _id, articleStatus } = input;

		const result = await this.boardArticleModel.findOneAndUpdate(
			{ _id, memberId, articleStatus: BoardArticleStatus.ACTIVE },
			input,
			{ new: true },
		);

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (articleStatus === BoardArticleStatus.DELETE) {
			await this.memberService.memberStatusEditor({
				_id: memberId,
				targetKey: 'memberArticles',
				modifier: -1,
			});
		}

		return result;
	}

	public async getBoardArticles(memberId: ObjectId, input: BoardArticlesInquiry): Promise<BoardArticles> {
		const { articleCategory, text, isFeatured } = input?.search ?? {};
		const match: T = {
			articleStatus: BoardArticleStatus.ACTIVE,
		};
		const sort: T = {
			[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};

		if (articleCategory) match.articleCategory = articleCategory;
		if (text) match.articleTitle = { $regex: new RegExp(text, 'i') };
		if (input.search?.memberId) {
			match.memberId = shapeIntoMongoObjectId(input.search.memberId);
		}

		const result = await this.boardArticleModel
			.aggregate([
				{ $match: match },
				...(isFeatured ? this.getIsFeatured() : []),
				{ $sort: sort },
				{
					$facet: {
						list: [
							{
								$skip: (input.page - 1) * input.limit,
							},
							{
								$limit: input.limit,
							},
							lookupAuthMemberLiked(memberId),
							lookupMember,
							{
								$unwind: '$memberData',
							},
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async getAllBoardArticlesByAdmin(input: AllBoardArticlesInquiry): Promise<BoardArticles> {
		const { articleStatus, articleCategory, articleTitle } = input.search;
		const match: T = {};

		const sort: T = {
			[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};

		if (articleStatus) match.articleStatus = articleStatus;

		if (articleCategory) match.articleCategory = articleCategory;
		if (articleCategory) match.articleTitle = { $regex: new RegExp(articleTitle.trim(), 'i') };

		const result = await this.boardArticleModel
			.aggregate([
				{ $match: match },
				...(input.sort === 'featuredScore' ? this.getIsFeatured() : []),
				{ $sort: sort },
				{
					$facet: {
						list: [
							{
								$skip: (input.page - 1) * input.limit,
							},
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [
							{
								$count: 'total',
							},
						],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async updateBoardArticleByAdmin(input: BoardArticleUpdate): Promise<BoardArticle> {
		const { _id, articleStatus } = input;
		const result = await this.boardArticleModel
			.findOneAndUpdate({ _id, articleStatus: BoardArticleStatus.ACTIVE }, input, { new: true })
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		await this.memberService.memberStatusEditor({
			_id: result.memberId,
			targetKey: 'memberArticles',
			modifier: -1,
		});

		return result;
	}

	public async removeBoardArticleByAdmin(articleId: ObjectId): Promise<BoardArticle> {
		const search: T = {
			_id: articleId,
			articleStatus: BoardArticleStatus.ACTIVE,
		};

		const result = await this.boardArticleModel
			.findOneAndUpdate(search, { articleStatus: BoardArticleStatus.DELETE }, { new: true })
			.exec();

		if (!result) {
			throw new InternalServerErrorException(Message.REMOVE_FAILED);
		}
		return result;
	}

	public async likeTargetBoardArticle(memberId: ObjectId, likeRefId: ObjectId): Promise<BoardArticle> {
		const target: BoardArticle = await this.boardArticleModel
			.findOne({
				_id: likeRefId,
				articleStatus: BoardArticleStatus.ACTIVE,
			})
			.exec();

		if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const input: LikeInput = {
			memberId: memberId,
			likeRefId: likeRefId,
			likeGroup: LikeGroup.ARTICLE,
		};

		const modifier: number = await this.likeService.toggleLike(input);
		const result = await this.boardArticleStatsEditor({
			_id: likeRefId,
			targetKey: 'articleLikes',
			modifier: modifier,
		});

		if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);

		return result;
	}

	public async boardArticleStatsEditor(input: StatisticModifiler): Promise<BoardArticle> {
		const { _id, targetKey, modifier } = input;
		return await this.boardArticleModel
			.findByIdAndUpdate(
				_id,
				{
					$inc: { [targetKey]: modifier },
				},
				{
					new: true,
				},
			)
			.exec();
	}

	private getIsFeatured() {
		return [
			{
				$addFields: {
					featuredScore: {
						$add: [
							{ $multiply: [{ $ln: { $add: [{ $ifNull: ['$articleComments', 0] }, 1] } }, 0.4] },
							{ $multiply: [{ $ln: { $add: [{ $ifNull: ['$articleLikes', 0] }, 1] } }, 0.3] },
							{ $multiply: [{ $ln: { $add: [{ $ifNull: ['$articleViews', 0] }, 1] } }, 0.3] },
						],
					},
				},
			},
			{ $match: { featuredScore: { $gte: 5 } } },
		];
	}
}
