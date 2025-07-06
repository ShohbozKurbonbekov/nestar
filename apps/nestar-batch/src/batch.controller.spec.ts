import { Test, TestingModule } from '@nestjs/testing';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';

describe('NestarBatchController', () => {
	let nestarBatchController: BatchController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [BatchController],
			providers: [BatchService],
		}).compile();

		nestarBatchController = app.get<BatchController>(BatchController);
	});

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(nestarBatchController.getHello()).toBe('Hello World!');
		});
	});
});
