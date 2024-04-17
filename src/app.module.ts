import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InferenceOrchestratorModule } from './InferenceOrchestrator/inference-orchestrator.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InferenceOrchestratorEntity } from './InferenceOrchestrator/sqlite/inference-orchestrator.entity';
import * as path from 'path';
import * as fs from 'fs';

import * as dotenv from 'dotenv';

dotenv.config(); 
const SQLITE_FOLDER_NAME = '/sqliteStorage';
const SQLITE_FILE_NAME = 'database.sqlite';
//const sqliteFolderPath = path.join(__dirname, SQLITE_FOLDER_NAME);
const sqliteFileName = path.join(SQLITE_FOLDER_NAME, SQLITE_FILE_NAME);

// Ensure the SQLite folder exists
if (!fs.existsSync(SQLITE_FOLDER_NAME)) {
    fs.mkdirSync(SQLITE_FOLDER_NAME);
}

// Ensure the SQLite file exists
if (!fs.existsSync(sqliteFileName)) {
    fs.writeFileSync(sqliteFileName, ''); // Create an empty file
}

@Module({
  imports: [
    InferenceOrchestratorModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: sqliteFileName, 
      entities: [InferenceOrchestratorEntity], 
      synchronize: true,
      logging: true
    }),
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
