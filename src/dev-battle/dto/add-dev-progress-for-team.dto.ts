import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { DevStatus } from '../entities/dev-progress-for-team.entity';

export class AddDevProgressForTeamDto {
    @IsString()
    @MaxLength(100)
    task: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    figmaUrl?: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    youtubeUrl?: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    noteUrl?: string;

    @IsEnum(DevStatus)
    @IsOptional()
    status: DevStatus;
}
