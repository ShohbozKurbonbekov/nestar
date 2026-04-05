import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PropertyChatService {
	constructor(@InjectModel('propertyMessages') private readonly messageModel: Model<any>) {}

	async createMessage(input: any) {
		return await this.messageModel.create(input);
	}
}
