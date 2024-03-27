import { Injectable } from '@nestjs/common';
import { CreateTtsDto } from './dto/create-inference-orchestrator.dto';
import { SuccessResponse } from '../shared/success';
import { ErrorResponse } from 'src/shared/error';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

const currentDir = __dirname;


@Injectable()
export class InferenceOrchestratorService {
  constructor( ) {}
  async create(createTaskDto: CreateTtsDto) {
    try {
   
      return SuccessResponse(
        201,
        'Text Inference successfully created...',
        {},
        null,
      );
    } catch (error) {
      return ErrorResponse(400, 'Unable to create task', {}, null);
    }
  }

  async findAllTrainedModel() {
    // Move two levels up from the current directory
      const folderPath = path.join(currentDir, '..', '..', '..');
      console.log("folderPath"); 
     console.log(folderPath); 
    
    const trainedModel = await this.getFolderNames(folderPath)
    //const trainedModel = ['Base', 'HP', 'LC', 'LJ-v1', 'LJ-v2', 'refAudio', 'XY' ]
  return SuccessResponse(200, 'all trained model name now retrieved...', trainedModel, null);
  }

  async removeProccessedVoice(taskId: any) {
    return SuccessResponse(
      200,
      `${taskId} file successfully deleted`,
      {},
      null,
    );
  
  }

  async getFolderNames(directoryPath: string): Promise<string[]> {
  try {
    const contents = await fsPromises.readdir(directoryPath);
    const folders = contents.filter(async item => {
      const itemPath = path.join(directoryPath, item);
      const stats = await fsPromises.stat(itemPath);
      return stats.isDirectory();
    });
    console.log(folders)
    return folders;
  } catch (error) {
    // Handle error (e.g., log or throw)
    console.error('Error reading directory:', error);
    throw error;
  }
  }
}
