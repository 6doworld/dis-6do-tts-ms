import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InferenceOrchestratorModule } from './InferenceOrchestrator/inference-orchestrator.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InferenceOrchestratorEntity } from './InferenceOrchestrator/sqlite/inference-orchestrator.entity';
import * as path from 'path';


import * as dotenv from 'dotenv';

dotenv.config(); 
const SQLITE_FOLDER_NAME = './sqliteStorage';
const SQLITE_FILE_NAME = 'database.sqlite';
const sqliteFileName = path.join(SQLITE_FOLDER_NAME, SQLITE_FILE_NAME);

@Module({
  imports: [
    InferenceOrchestratorModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: sqliteFileName, 
        entities: [InferenceOrchestratorEntity], 
        synchronize: process.env.synchronize === 'true',
        logging: true
      }),
      inject: [],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
