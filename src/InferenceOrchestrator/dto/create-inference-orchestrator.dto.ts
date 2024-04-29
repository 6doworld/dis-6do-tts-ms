import { IsString, IsNotEmpty,  IsOptional } from 'class-validator';

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

  
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @IsString()
  @IsOptional()
  username: string;

}
