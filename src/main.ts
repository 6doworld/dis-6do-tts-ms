import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

import * as dotenv from 'dotenv';

dotenv.config(); 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // Serve static files from the 'ttsVoiceOutput' directory
    app.useGlobalPipes(new ValidationPipe());
    app.use('/ttsVoiceOutput', express.static(path.resolve(__dirname, '..', 'ttsVoiceOutput')));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
