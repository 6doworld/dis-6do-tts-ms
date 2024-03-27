import {
  Controller,
  Get,
  Res,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { InferenceOrchestratorService } from './inference-orchestrator.service';
import { CreateTtsDto } from './dto/create-inference-orchestrator.dto';

import { InferenceOrchestratorRoute } from './constants/constants';

@Controller(InferenceOrchestratorRoute.INFERENCE_ORCHESTRATOR)
export class InferenceOrchestratorController {
  constructor(private readonly inferenceOrchestratorService: InferenceOrchestratorService) {}

  @Post()
  async createTask(@Body() createTtsDto: CreateTtsDto, @Res() res: any) {
    const response = await this.inferenceOrchestratorService.create(createTtsDto);
    res.status(response.responseCode).json(response);
  }

  @Get(InferenceOrchestratorRoute.TRAINED_MODEL)
  async findAllTrainedModel( @Res() res: any) {
    const response = await this.inferenceOrchestratorService.findAllTrainedModel();
    res.status(response.responseCode).json(response);
  }


  @Delete(InferenceOrchestratorRoute.FILE_NAME)
  async remove(@Param('id') fileName: string, @Res() res:any) {
    const response = await this.inferenceOrchestratorService.removeProccessedVoice(fileName);
    res.status(response.responseCode).json(response);
  }
}
