import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InferenceOrchestratorModule } from './InferenceOrchestrator/inference-orchestrator.module';

@Module({
  imports: [InferenceOrchestratorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
