import { IsNotEmpty, IsString, IsNumber, IsDate, Min } from 'class-validator';

export class CreateSubChallengeDto {
    @IsNotEmpty()
    @IsString()
    challengeName: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    prize: number;

    @IsString()
    deadline: string;
}
