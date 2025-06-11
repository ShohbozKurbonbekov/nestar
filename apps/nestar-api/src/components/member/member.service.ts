import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { MemberInput } from '../../libs/dto/member/member.input';

@Injectable()
export class MemberService {
	constructor(@InjectModel('Member') private readonly memberModel: Model<Member>) {}

	public async signup(input: MemberInput): Promise<Member> {
		try {
			// HASH Password
			const result = await this.memberModel.create(input);

			// Authentication via tokens

			return result;
		} catch (error) {
			console.log('Error in signup service model: ', error);
			throw new BadRequestException(error);
		}
	}
	public async login(): Promise<string> {
		return 'login executed';
	}
	public async updateMember(): Promise<string> {
		return 'updateMember executed';
	}
	public async getMember(): Promise<string> {
		return 'getMember executed';
	}
}
