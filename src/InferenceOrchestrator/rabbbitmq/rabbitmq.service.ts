import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib/callback_api';
import * as dotenv from 'dotenv';
//import { InferenceOrchestratorSQLiteService } from '../sqlite/inference-orchestrator.service';

dotenv.config(); 

const RABBIT_MQ_HOST = process.env.RABBIT_MQ_HOST
const RABBIT_MQ_PASS= process.env.RABBIT_MQ_PASS
const RABBIT_MQ_USER = process.env.RABBIT_MQ_USER
const VHOST  = process.env.VHOST

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  public isConnected: boolean = false;

  constructor() {
    this.connectToRabbitMQ(); 
    
  }

  private async connectToRabbitMQ(): Promise<void> {
    try {
      this.connection = await new Promise<amqp.Connection>((resolve, reject) => {
        amqp.connect(`amqp://${RABBIT_MQ_USER}:${RABBIT_MQ_PASS}@${RABBIT_MQ_HOST}/${VHOST}`, (error: Error, connection: amqp.Connection) => {
          if (error) {
            console.log(error)
            reject(error);
          }
          resolve(connection);
        });
      });

      console.log('Connected to RabbitMQ successfully');
  
      this.channel = await new Promise<amqp.Channel>((resolve, reject) => {
        if (!this.connection) {
          console.log("connection not established")
          reject(new Error('Connection is not established'));
        }
  
        this.connection.createChannel((error: Error, channel: amqp.Channel) => {
          if (error) {
            console.log(error)
            reject(error);
          }
          
          console.log('Channel created successfully');
            // Set isConnected to true after connection is established
          this.isConnected = true;
          resolve(channel);
        });
      }); 
     
      // after channel created, check database for any processing task that needs to be retrried
  //  const pendindTask =  await this.inferenceOrchestratorSQLiteService.findAll({where: {status: 'P'}});
  //        pendindTask.map((pendingTask) => {
  //         const  pendindTaskBodyData = JSON.stringify({
  //           taskId:pendingTask.taskId,
  //           text: pendingTask.text,
  //           textLanguage: pendingTask .language,
  //           modelName: pendingTask.model
  //         });
  //         this.sendToQueue('awaiting_processing_ms', pendindTaskBodyData , {} )
  //       })
  
    } catch (error) { 
      console.error('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  // function to send request to queue
  public async sendToQueue(queue: string, message: string, headers: any): Promise<void> {
    try {
      // Assert queue to make sure it exists
      this.channel.assertQueue(queue, { durable: true });
      this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true, headers });
      console.log(`[RabbitMQService] Sent ${message} to ${queue}`);
    } catch (error) {
      console.error(`[RabbitMQService] Error sending message to queue ${queue}:`, error);
      throw error;
    }
  }

  public async consumeFromQueue(queue: string, callback: (message: amqp.Message | null) => void): Promise<void> {
    console.log(queue)
    try {
      this.channel.assertQueue(queue, { durable: true });
      this.channel.consume(queue, callback, { noAck: true });
      console.log(`[RabbitMQService] Started consuming messages from ${queue} queue`);
    } catch (error) {
      console.error(`[RabbitMQService] Error consuming messages from ${queue} queue:`, error);
      throw error;
    }
  }

}
