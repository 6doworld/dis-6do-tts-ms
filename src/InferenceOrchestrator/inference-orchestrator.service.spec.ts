import { Test, TestingModule } from '@nestjs/testing';
import { InferenceOrchestratorService } from './inference-orchestrator.service';

describe('TasksService', () => {
  let service: InferenceOrchestratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InferenceOrchestratorService],
    }).compile();

    service = module.get<InferenceOrchestratorService>(InferenceOrchestratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
