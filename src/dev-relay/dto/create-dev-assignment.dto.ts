// src\dev-relay\dto\create-dev-assignment.dto.ts
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { WeekDay } from '../entities/dev-assignment.entity';

export class CreateDevAssignmentDto {
    @IsString()
    day: WeekDay;

    @IsString()
    title: string;

}
