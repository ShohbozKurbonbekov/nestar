import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingIntercepter } from './libs/intercepter/Logging.intercepter';
import { graphqlUploadExpress } from 'graphql-upload';
import * as express from 'express';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new LoggingIntercepter());
	app.enableCors({ origin: true, credentials: true });

	app.use(graphqlUploadExpress({ maxFileSize: 15_000_000, maxFiles: 10 }));

	app.use('/uploads', express.static('./uploads'));

	app.useWebSocketAdapter(new IoAdapter(app));
	await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
