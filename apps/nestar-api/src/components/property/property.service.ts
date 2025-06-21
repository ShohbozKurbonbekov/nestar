import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Mutation } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PropertyInput } from '../../libs/dto/property/property.input';
import { Property } from '../../libs/dto/property/property';
import { Message } from '../../libs/enums/common.enum';
import { MemberService } from '../member/member.service';

@Injectable()
export class PropertyService {
	constructor(
		@InjectModel('Property') private readonly propertyModel: Model<Property>,
		private readonly memberService: MemberService,
	) {}

	public async createProperty(input: PropertyInput): Promise<Property> {
		try {
			const result = await this.propertyModel.create(input);

			await this.memberService.memberStatusEditor({ _id: result.memberId, targetKey: 'memberProperties', modifier: 1 });

			return result;
		} catch (error) {
			console.log('Error', 'createProperty:Service:model: ', error);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}
}
