export enum HttpCode {
	OK = 200,
	CREATED = 201,
	NOT_MODIFIELD = 304,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500,
	CONFLICT = 409,
}

export enum Message {
	INVALID_TOKEN = 'Invalid  token!',
	SESSION_EXPIRED = 'Session expired, Please login again!',
	SYSTEM_PROBLEM = 'System problem, please try later!',
	ACCESS_DENIED = 'Access denied!s',
	SOMETHING_WENT_WRONG = 'Something went wrong',
	NO_DATA_FOUND = 'No data is found',
	CREATING_FAILED = 'Creating is failed!',
	UPDATING_FAILED = 'Updating is failed!',
	TOKEN_CREATION_FAILED = 'Token creation error!',
	NOT_AUTHENTICATED = 'You are not authenticated, Please Login First',
	ADMIN_ONLY = 'Admin page!',
	CONVERSATION_BLOCKED = 'Conversation is blocked!',
	USER_ONLINE_ERROR = 'User online error',
	DISCONNECT_ERROR = 'Disconnect error',
	ERROR_LOGOUT = 'Error in logout',
	PRESENCE_CHECK_FAILED = 'Presence check failed!',
	CONVERSATION_NOT_FOUND = 'Conversation is not found!',
	MESSAGE_SEND_FAILED = 'Message sending failed!',
	MORE_MESSAGES_FAILED = 'Error in getting more messages!',
	TOKEN_NOT_EXIST = 'TOKEN_NOT_EXIST',
	ONLY_SPECIFIC_ROLES_ALLOWED = 'ONLY_SPECIFIC_ROLES_ALLOWED',
}

class Errors extends Error {
	public code: HttpCode;
	public message: Message;
	static standart: {
		code: HttpCode.INTERNAL_SERVER_ERROR;
		message: Message.SOMETHING_WENT_WRONG;
	};

	constructor(statusCode: HttpCode, statusMessage: Message) {
		super();
		this.code = statusCode;
		this.message = statusMessage;
	}
}

export default Errors;
