import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTtsDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  modelName: string;

  
  @IsString()
  @IsNotEmpty()
  textLanguage: string;


}
