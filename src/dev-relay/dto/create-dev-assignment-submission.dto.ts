// src\dev-relay\dto\create-dev-assignment-submission.dto.ts 추가 필요
import { IsString, IsOptional, IsUrl } from 'class-validator';
import { WeekDay } from '../entities/dev-assignment.entity';

export class CreateDevAssignmentSubmissionDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsUrl()
    noteUrl?: string;

    @IsOptional()
    @IsUrl()
    figmaUrl?: string;

    @IsOptional()
    @IsUrl()
    youtubeUrl?: string;

}
