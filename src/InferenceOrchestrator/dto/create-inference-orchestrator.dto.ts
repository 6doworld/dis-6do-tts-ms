import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTtsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
