import { Injectable } from '@nestjs/common';
import { CreateTtsDto } from './dto/create-inference-orchestrator.dto';
import { SuccessResponse } from '../shared/success';
import { ErrorResponse } from 'src/shared/error';
import { RabbitMQService } from './rabbbitmq/rabbitmq.service';
import { InferenceOrchestratorSQLiteService } from './sqlite/inference-orchestrator.service';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import * as fsExtra from 'fs-extra';
import axios from 'axios';
import * as dotenv from 'dotenv';

const currentDir = __dirname;
dotenv.config(); 

const ML_BASE_URL = process.env.ML_BASE_URL


@Injectable()
export class InferenceOrchestratorService {
  constructor(
     private readonly rabbitMQService: RabbitMQService,
     private readonly inferenceOrchestratorSQLiteService: InferenceOrchestratorSQLiteService,
    
    ) {}

  // create a tts
  async create(createTtsDto: CreateTtsDto) {
    try {

     // const folderPath = path.join('/trainedModel');

      // const trainedModelFolders = await this.getFolderNames(folderPath)
     
      // if (!trainedModelFolders.includes(createTtsDto.modelName))
      // return ErrorResponse(
      //   400,
      //   'Model name not valid. Use a valid model name...',
      //   {},
      //   null,
      // );

        
        const requestBodyData = JSON.stringify({
          taskId:createTtsDto.taskId,
          text: createTtsDto.text,
          textLanguage: createTtsDto .textLanguage,
          modelName: createTtsDto.modelName
        });
        const sqliteDto = {
          taskId:createTtsDto.taskId,
          text: createTtsDto.text,
          language: createTtsDto .textLanguage,
          model: createTtsDto.modelName,
          status: 'A',
          statusMessage: 'Awaiting Processing'
        };
       const header = {
        taskId:createTtsDto.taskId,
        text: createTtsDto.text,
        textLanguage: createTtsDto .textLanguage,
        modelName: createTtsDto.modelName
       }
        // Send the requestBody data to the queue
        await this.inferenceOrchestratorSQLiteService.create(sqliteDto)
        await this.rabbitMQService.sendToQueue('awaiting_processing', requestBodyData, header );
        await this.rabbitMQService.sendToQueue('awaiting_processing_ms', requestBodyData, header);
      

      return SuccessResponse(
        201,
        'Text Inference Proccessing...',
        {},             
        null,
      );
    } catch (error) {
      // Handle error from setModel
      console.error('Error creating text to speach', error.message);
      return ErrorResponse(400, `${error.message}`, {}, null);
    }
  }

  //GET ALL TRAINED MODEL
  async findAllTrainedModel() {
    // Move two levels up from the current directory and go to trained model directory
    //const folderPath = path.join('/trainedModel');
    // const trainedModel = await this.getFolderNames(folderPath)
    const trainedModel = ['Base', 'HP', 'LC', 'LJ-v1', 'LJ-v2', 'refAudio', 'XY' ]
    return SuccessResponse(200, 'all trained model name now retrieved...', trainedModel, null);
  }

  //delete output file afetr acknoledgement
  async removeProccessedVoice(fileName: string) {

    const filePath = path.join(__dirname, '..', '..', 'ttsVoiceOutput', `${fileName}.wav`);

    try {
      await fsExtra.remove(filePath);
      console.log(`File ${fileName}.wav removed successfully.`);
      return SuccessResponse(
        201,
        `File ${fileName}.wav removed successfully......`,
        {},
        null,
      );
    } catch (error) {
      console.error(`Error removing file ${fileName}: ${error.message}`);
      throw error;
    }
    
  
    
  
  }

  // get folder names
  async getFolderNames(directoryPath: string): Promise<string[]> {
  try {
    // const contents = await fsPromises.readdir(directoryPath);
    // const folders = contents.filter(async item => {
    //   const itemPath = path.join(directoryPath, item);
    //   const stats = await fsPromises.stat(itemPath);
    //   return stats.isDirectory();
    // });
    const folders = ['Base', 'HP', 'LC', 'LJ-v1', 'LJ-v2', 'refAudio', 'XY' ]

    return folders;
  } catch (error) {
    
    console.error('Error reading directory:', error);
    throw error;
  }
  }

  // Function to set model dynamically
  async setModel( gptModelPath: string, sovitsModelPath: string) {
    try {
      const response = await axios.post(`${ML_BASE_URL}/set_model`, {
        gpt_model_path: gptModelPath,
        sovits_model_path: sovitsModelPath
      });
      console.log(`Model set successfully`, response.data);
    } catch (error) {
      console.error(`Error setting model for user`, error.message);
      throw error;
    }
  }

  // Function to run inference and save output to a file
  async runInferenceAndSave( text: string, language: string, outputFilename: string, folderName: string): Promise<void> {
    try {
      //  the full output folder path including the created folder
      const outputFolderPath = path.join(`/${folderName}`);
      const outputFilePath = path.join(outputFolderPath, outputFilename);

      // if the folder doesn't exist
      await fsPromises.mkdir(outputFolderPath, { recursive: true });

      // Run inference and save output to the file
      const response = await axios.post(`${ML_BASE_URL}`, {
        text,
        text_language: language,
        slice: '凑30字一切'
      }, {
        responseType: 'arraybuffer' 
      });

      await fsPromises.writeFile(outputFilePath, response.data);

     // console.log(`Inference completed successfully. Audio saved as: ${outputFilePath}`);
    } catch (error) {
      console.error(`Error running inference`, error.message);
      throw error 
    }
  }

  // generate randoms string
  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const timestamp = Date.now().toString(); // Get current timestamp
    const combinedString = result + timestamp; // Concatenate random string and timestamp
    return combinedString;
  }

}
