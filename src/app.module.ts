import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InferenceOrchestratorModule } from './InferenceOrchestrator/inference-orchestrator.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InferenceOrchestratorEntity } from './InferenceOrchestrator/sqlite/inference-orchestrator.entity';
import * as path from 'path';

@Module({
  imports: [
    InferenceOrchestratorModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: path.join(__dirname, '..', 'sqliteStorage', 'database.sqlite'),
        entities: [InferenceOrchestratorEntity],
        synchronize: true,
        logging: true
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
