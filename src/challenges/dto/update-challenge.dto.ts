import { IsNotEmpty, IsString, IsNumber, Min, IsDateString } from 'class-validator';

export class UpdateChallengeDto {
    @IsString()
    challengeName: string;

    @IsString()
    description: string;

    @IsString()
    prize: number;

    @IsDateString()
    deadline: string;
}
