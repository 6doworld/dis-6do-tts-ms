import { Module } from '@nestjs/common';
import { InferenceOrchestratorService } from './inference-orchestrator.service';
import { InferenceOrchestratorController } from './inference-orchestrator.controller';

@Module({
  imports: [],
  controllers: [InferenceOrchestratorController],
  providers: [InferenceOrchestratorService],
})
export class InferenceOrchestratorModule {}
