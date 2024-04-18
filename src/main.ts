import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

import * as dotenv from 'dotenv';

dotenv.config(); 

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Serve static files from the 'ttsVoiceOutput' directory
    app.useGlobalPipes(new ValidationPipe());
    app.use('/ttsVoiceOutput', express.static(path.resolve(__dirname, '..', 'ttsVoiceOutput')));

    await app.listen(process.env.PORT || 3000);
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      console.error('An error occurred:', error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    process.exit(1); // Exit the application with a non-zero status code
  }
}
bootstrap();
