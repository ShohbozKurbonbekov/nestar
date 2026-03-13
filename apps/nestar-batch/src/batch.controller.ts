import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_AGENTS, BATCH_TOP_PROPERTIES } from './lib/config';

@Controller()
export class BatchController {
	private logger: Logger = new Logger('BartchController');

	constructor(private readonly BatchService: BatchService) {}

	@Timeout(1000)
	handleTimeout() {
		this.logger.debug('timeout is running here');
	}

	@Cron('00 * * * * *', { name: BATCH_ROLLBACK })
	public async batchRollback() {
		try {
			this.logger['context'] = BATCH_ROLLBACK;
			this.logger.debug('EXECUTED');
			await this.BatchService.batchRollback();
		} catch (error) {
			this.logger.error(error);
		}
	}

	@Cron('20 * * * * *', { name: BATCH_TOP_PROPERTIES })
	public async batchTopProperties() {
		try {
			this.logger['context'] = BATCH_TOP_PROPERTIES;
			this.logger.debug('EXECUTED');
			await this.BatchService.batchTopProperties();
		} catch (error) {
			this.logger.error(error);
		}
	}

	@Cron('40 * * * * *', { name: BATCH_TOP_AGENTS })
	public async batchTopAgents() {
		try {
			this.logger['context'] = BATCH_TOP_AGENTS;
			this.logger.debug('EXECUTED');
			await this.BatchService.batchTopAgents();
		} catch (error) {
			this.logger.error(error);
		}
	}

	@Get()
	getHello(): string {
		return this.BatchService.getHello();
	}
}
