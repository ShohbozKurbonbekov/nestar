import { ObjectId } from 'bson';
export const shapeIntoMongoObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};

export const availableAgentSort = ['created', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank'];

export const availableMemberSort = ['created', 'updatedAt', 'memberLikes', 'memberViews'];
