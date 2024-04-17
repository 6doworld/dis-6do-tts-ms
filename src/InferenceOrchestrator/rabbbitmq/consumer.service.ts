import { Injectable } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import {InferenceOrchestratorService} from '../inference-orchestrator.service'
import { InferenceOrchestratorSQLiteService } from '../sqlite/inference-orchestrator.service';

import * as amqp from 'amqplib/callback_api';

import * as dotenv from 'dotenv';

dotenv.config(); 

const MS_BASE_URL = process.env.MS_BASE_URL


@Injectable()
export class RabbitMQConsumerService {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly inferenceOrchestratorService: InferenceOrchestratorService,
    // private readonly inferenceOrchestratorSQLiteService: InferenceOrchestratorSQLiteService

    ) {
    this.startConsuming();
  }
 
  private async startConsuming(): Promise<void> {
    try {
        console.log("start consuming on server start")
    // Wait until RabbitMQService establishes the connection
     while (!this.rabbitMQService.isConnected) {
      // Wait for 1 second
        await new Promise(resolve => setTimeout(resolve, 1000)); 
      }
      
      await this.rabbitMQService.consumeFromQueue('awaiting_processing_ms', this.processMessage.bind(this));
    } catch (error) {
      console.error('Error starting consumer:', error);
    }
  }

  private async processMessage(message: amqp.Message | null): Promise<void> {
    console.log("start consuming as we have an awaiting processing")
    console.log(message)
    if (!message) {
      console.warn('Empty message received');
      return;
    }

    try {
      // Parse message
      var newMessage = JSON.parse(message.content.toString());
     
   
      await this.inferenceOrchestratorSQLiteService.updateStatusByTaskId(newMessage.taskId, 'P', 'Processing')

      const gptModelPath = `trainedModel/${newMessage.modelName}/ref.ckpt`;
      const sovitsModelPath = `trainedModel/${newMessage.modelName}/ref.pth`;
      const randomString = this.inferenceOrchestratorService.generateRandomString(5)

       // Set the model first
       await this.inferenceOrchestratorService.setModel(gptModelPath, sovitsModelPath);
      
       // If the model is set successfully, proceed with inference
       await this.inferenceOrchestratorService.runInferenceAndSave(
         newMessage.text,
         newMessage.textLanguage,
         randomString + '.wav', 
         'ttsVoiceOutput'
       );
       
       const downloadLink = `${MS_BASE_URL}/ttsVoiceOutput/${randomString}.wav`;

      // Post to finished_processing queue
       await this.inferenceOrchestratorSQLiteService.updateStatusByTaskId(newMessage.taskId, 'F', 'Finished Processing')
       const header = { task_id: newMessage.taskId, download_url: downloadLink }
       await this.rabbitMQService.sendToQueue('finished_processing', JSON.stringify({}),  header);
    
    } catch (error) {
      console.error('Error processing message:', error);
      await this.inferenceOrchestratorSQLiteService.updateStatusByTaskId(newMessage.taskId, 'E', 'Error Processing')
      const header = { task_id: newMessage.taskId, error_message: 'Error processing message: Please retry' }
      await this.rabbitMQService.sendToQueue('error_processing', JSON.stringify({}), header);

    }
  }
}
