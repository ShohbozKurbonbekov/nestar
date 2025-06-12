import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingIntercepter implements NestInterceptor {
	private readonly logger: Logger = new Logger();

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const recordTime = Date.now();
		const requestType = context.getType<GqlContextType>();

		if (requestType === 'http') {
			// DEVELOP IF NEEDED
		} else if (requestType === 'graphql') {
			// (1)print request
			const gqlContext = GqlExecutionContext.create(context);

			this.logger.log(`${this.stringify(gqlContext.getContext().req.body)}`, 'Request');

			// (2) Errors handling via Graphql

			//(3) No Errors, giving response
			return next.handle().pipe(
				tap((contex) => {
					const responseTime = Date.now() - recordTime;
					this.logger.log(`${this.stringify(contex)} - ${responseTime}ms \n\n`, 'Response');
				}),
			);
		}
	}

	private stringify(contex: ExecutionContext): string {
		return JSON.stringify(contex).slice(0, 75);
	}
}
