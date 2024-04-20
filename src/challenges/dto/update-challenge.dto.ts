import { IsOptional, IsString, IsNumber, Min, IsDateString } from 'class-validator';

export class UpdateChallengeDto {
    @IsString()
    @IsOptional()
    challengeName?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    prize?: number;

    @IsDateString()
    @IsOptional()
    deadline?: string;
}