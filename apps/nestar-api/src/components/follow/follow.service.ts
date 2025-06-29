import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FollowService {
	constructor(@InjectModel('Follow') private readonly followModel: Model<null>) {}
}
