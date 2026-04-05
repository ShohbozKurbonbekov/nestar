import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PropertyChatService {
	constructor(@InjectModel('ChatMessage') private readonly chatMessageModel: Model<any>) {}

	async createMessage(input: any) {
		return await this.chatMessageModel.create(input);
	}
}
