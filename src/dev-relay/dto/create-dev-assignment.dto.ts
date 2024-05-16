// src\dev-relay\dto\create-dev-assignment.dto.ts
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { WeekDay, AssignmentCategory } from '../entities/dev-assignment.entity';

export class CreateDevAssignmentDto {
    @IsEnum(WeekDay)
    day: WeekDay;

    @IsString()
    title: string;

    @IsOptional()
    @IsEnum(AssignmentCategory)
    category?: AssignmentCategory;
}
