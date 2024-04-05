import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InferenceOrchestratorEntity } from './inference-orchestrator.entity'; 

@Injectable()
export class InferenceOrchestratorSQLiteService {
  constructor(
    @InjectRepository(InferenceOrchestratorEntity)
    private readonly inferenceOrchestratorRepository: Repository<InferenceOrchestratorEntity>,
  ) {}

  async create(data: Partial<InferenceOrchestratorEntity>): Promise<InferenceOrchestratorEntity> {
    const entity = this.inferenceOrchestratorRepository.create(data);
    return this.inferenceOrchestratorRepository.save(entity);
  }

  async findAll(whereClause:Object): Promise<InferenceOrchestratorEntity[]> {
    return this.inferenceOrchestratorRepository.find(whereClause);
  } 

  async findOne(whereClause:Object): Promise<InferenceOrchestratorEntity | null> {
    return this.inferenceOrchestratorRepository.findOne(whereClause);
  }
  

  async update(id: number, data: Partial<InferenceOrchestratorEntity>): Promise<InferenceOrchestratorEntity | null> {
    await this.inferenceOrchestratorRepository.update(id, data);
    return this.inferenceOrchestratorRepository.findOne({where: {id}});
  }


  async updateStatusByTaskId(taskId: string, newStatus: string, newStatusMessage:string): Promise<void> {
    await this.inferenceOrchestratorRepository
      .createQueryBuilder()
      .update(InferenceOrchestratorEntity)
      .set({ status: newStatus, statusMessage:newStatusMessage })
      .where('taskId = :taskId', { taskId })
      .execute();
  }
  
  async remove(id: number): Promise<void> {
    await this.inferenceOrchestratorRepository.delete(id);
  }

  async deleteByTaskId(taskId: string): Promise<void> {
    await this.inferenceOrchestratorRepository
      .createQueryBuilder()
      .delete()
      .from(InferenceOrchestratorEntity)
      .where('taskId = :taskId', { taskId })
      .execute();
  }
}