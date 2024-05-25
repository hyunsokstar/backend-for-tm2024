// src/dev-relay/dto/create-subject-for-category.dto.ts
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { CategoryForDevAssignmentDto } from './category-for-dev-assignment.dto';

export class CreateSubjectDto {
    @IsString()
    name: string;
}
