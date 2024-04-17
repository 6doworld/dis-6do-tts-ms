import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InferenceOrchestratorService } from './inference-orchestrator.service';
import { RabbitMQService } from './rabbbitmq/rabbitmq.service';
import { RabbitMQConsumerService } from './rabbbitmq/consumer.service';
import { InferenceOrchestratorController } from './inference-orchestrator.controller';
import { InferenceOrchestratorSQLiteService } from './sqlite/inference-orchestrator.service';
import { InferenceOrchestratorEntity } from './sqlite/inference-orchestrator.entity'; 
import { InferenceOrchestratorSQLiteController } from './sqlite/inference-orchestrator.controller'; 

@Module({
  imports: [TypeOrmModule.forFeature([InferenceOrchestratorEntity])],
  controllers: [InferenceOrchestratorController, InferenceOrchestratorSQLiteController],
  providers: [InferenceOrchestratorService, RabbitMQService, RabbitMQConsumerService,InferenceOrchestratorSQLiteService],
})
export class InferenceOrchestratorModule {}
