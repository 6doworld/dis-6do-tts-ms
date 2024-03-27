import { Test, TestingModule } from '@nestjs/testing';
import { InferenceOrchestratorController } from './inference-orchestrator.controller';
import { InferenceOrchestratorService } from './inference-orchestrator.service';

describe('InferenceOrchestratorController', () => {
  let controller: InferenceOrchestratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InferenceOrchestratorController],
      providers: [InferenceOrchestratorService],
    }).compile();

    controller = module.get<InferenceOrchestratorController>(InferenceOrchestratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
