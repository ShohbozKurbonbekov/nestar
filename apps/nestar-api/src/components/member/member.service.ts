import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { MemberStatus } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { Mutation } from '@nestjs/graphql';

@Injectable()
export class MemberService {
	constructor(
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		private AuthService: AuthService,
	) {}

	public async signup(input: MemberInput): Promise<Member> {
		try {
			input.memberPassword = await this.AuthService.hashPassword(input.memberPassword);

			const result = await this.memberModel.create(input);

			// Authentication via tokens
			result.accessToken = await this.AuthService.createToken(result);

			return result;
		} catch (error) {
			console.log('Error in signup service model: ', error.message);
			throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
		}
	}
	public async login(input: LoginInput): Promise<Member> {
		const { memberNick, memberPassword } = input;
		const response: Member | null = (await this.memberModel
			.findOne({
				memberNick,
			})
			.select('+memberPassword')
			.exec()) as Member;

		if (!response || response.memberStatus === MemberStatus.DELETE) {
			throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
		} else if (response.memberStatus === MemberStatus.BLOCK) {
			throw new InternalServerErrorException(Message.BLOCKED_USER);
		}

		//Compare passwords
		const isMatch = await this.AuthService.comparePasswords(input.memberPassword, response.memberPassword);

		if (!isMatch) {
			throw new InternalServerErrorException(Message.WRONG_PASSWORD);
		}

		response.accessToken = await this.AuthService.createToken(response);
		return response;
	}

	public async updateMember(): Promise<string> {
		return 'updateMember executed';
	}
	public async getMember(): Promise<string> {
		return 'getMember executed';
	}

	public async getAllMembersByAdmin(): Promise<string> {
		return 'getAllMembersByAdmin executed';
	}
	public async updateMemberByAdmin(): Promise<string> {
		return 'updateMemberByAdmin executed';
	}
}
