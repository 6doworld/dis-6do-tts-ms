import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InferenceOrchestratorModule } from './InferenceOrchestrator/inference-orchestrator.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InferenceOrchestratorEntity } from './InferenceOrchestrator/sqlite/inference-orchestrator.entity';
import * as path from 'path';

import * as dotenv from 'dotenv';

dotenv.config(); 
const SQLITE_FOLDER_NAME = process.env.SQLITE_FOLDER_NAME
const SQLITE_FILE_NAME = process.env.SQLITE_FILE_NAME
const sqliteFolderPath = path.join(__dirname,   '..', SQLITE_FOLDER_NAME!);
const sqliteFileName = path.join(sqliteFolderPath, SQLITE_FILE_NAME!);
 
@Module({
  imports: [
    InferenceOrchestratorModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: sqliteFileName, 
      entities: [InferenceOrchestratorEntity], 
      synchronize: true,
      logging:true
    }),
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
