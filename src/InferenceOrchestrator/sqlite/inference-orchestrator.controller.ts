import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { InferenceOrchestratorSQLiteService } from './inference-orchestrator.service';
import { InferenceOrchestratorEntity } from './inference-orchestrator.entity'; // Import your entity
import { InferenceOrchestratorRoute } from '../constants/constants';
@Controller(InferenceOrchestratorRoute.INFERENCE_ORCHESTRATOR_SQLITE)
export class InferenceOrchestratorSQLiteController {
  constructor(private readonly inferenceOrchestratorSqliteService: InferenceOrchestratorSQLiteService) {}

  @Post()
  create(@Body() data: Partial<InferenceOrchestratorEntity>): Promise<InferenceOrchestratorEntity> {
    return this.inferenceOrchestratorSqliteService.create(data);
  }

  @Get()
  findAll(): Promise<InferenceOrchestratorEntity[]> {
    return this.inferenceOrchestratorSqliteService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<InferenceOrchestratorEntity | null> {
    return this.inferenceOrchestratorSqliteService.findOne({where:{id}});
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<InferenceOrchestratorEntity>): Promise<InferenceOrchestratorEntity | null> {
    return this.inferenceOrchestratorSqliteService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.inferenceOrchestratorSqliteService.remove(+id);
  }
}
 