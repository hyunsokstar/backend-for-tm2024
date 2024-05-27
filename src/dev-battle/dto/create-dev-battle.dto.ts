import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TagDto } from './tag.dto';

export class CreateDevBattleDto {
    @IsString()
    subject: string;
}
