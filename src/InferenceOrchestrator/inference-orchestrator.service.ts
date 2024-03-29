import { Injectable } from '@nestjs/common';
import { CreateTtsDto } from './dto/create-inference-orchestrator.dto';
import { SuccessResponse } from '../shared/success';
import { ErrorResponse } from 'src/shared/error';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import * as fsExtra from 'fs-extra';
import axios from 'axios';
import * as dotenv from 'dotenv';

const currentDir = __dirname;
dotenv.config(); 

const MS_BASE_URL = process.env.MS_BASE_URL
const ML_BASE_URL = process.env.ML_BASE_URL


@Injectable()
export class InferenceOrchestratorService {
  constructor( ) {}

  // create a tts
  async create(createTtsDto: CreateTtsDto) {
    try {
      const gptModelPath = `trainedModel/${createTtsDto.modelName}/ref.ckpt`;
      const sovitsModelPath = `trainedModel/${createTtsDto.modelName}/ref.pth`;
      const randomString = this.generateRandomString(5);

      const folderPath = path.join(currentDir, '..', '..', '..' , 'GPT-SoVITS/trainedModel');

      const trainedModelFolders = await this.getFolderNames(folderPath)
     
      if (!trainedModelFolders.includes(createTtsDto.modelName))
      return ErrorResponse(
        400,
        'Model name not valid. Use a valid model name...',
        {},
        null,
      );
      
      // Set the model first
      await this.setModel(gptModelPath, sovitsModelPath);
      
      // If the model is set successfully, proceed with inference
      await this.runInferenceAndSave(
        createTtsDto.text,
        createTtsDto.textLanguage,
        randomString + '.wav', 
        'ttsVoiceOutput'
      );
  
      const downloadLink = `${MS_BASE_URL}/ttsVoiceOutput/${randomString}.wav`;
      return SuccessResponse(
        201,
        'Text Inference successfully created...',
        {downloadLink},
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
    const folderPath = path.join(currentDir, '..', '..', '..' , 'dis-6do-tts-ml/trainedModel');

    
    const trainedModel = await this.getFolderNames(folderPath)
    //const trainedModel = ['Base', 'HP', 'LC', 'LJ-v1', 'LJ-v2', 'refAudio', 'XY' ]
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
    const contents = await fsPromises.readdir(directoryPath);
    const folders = contents.filter(async item => {
      const itemPath = path.join(directoryPath, item);
      const stats = await fsPromises.stat(itemPath);
      return stats.isDirectory();
    });
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
      // Construct the full output folder path including the created folder
      const outputFolderPath = path.join(__dirname,  '..', '..', folderName);
      const outputFilePath = path.join(outputFolderPath, outputFilename);

      // Create the folder if it doesn't exist
      await fsPromises.mkdir(outputFolderPath, { recursive: true });

      // Run inference and save output to the file
      const response = await axios.post(`${ML_BASE_URL}`, {
        text,
        text_language: language,
        slice: '凑30字一切'
      }, {
        responseType: 'arraybuffer' // Receive response as array buffer
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
