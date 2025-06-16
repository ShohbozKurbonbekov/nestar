import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { MemberStatus } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MemberService {
	constructor(
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		private AuthService: AuthService,
	) {}

	public async signup(input: MemberInput): Promise<Member> {
		try {
			input.memberPassword = await this.AuthService.hashPassword(input.memberPassword);
			// HASH Password

			const result = await this.memberModel.create(input);

			// Authentication via tokens

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

		return response;
	}

	public async updateMember(): Promise<string> {
		return 'updateMember executed';
	}
	public async getMember(): Promise<string> {
		return 'getMember executed';
	}
}
