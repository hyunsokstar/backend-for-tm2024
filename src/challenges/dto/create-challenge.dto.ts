import { IsNotEmpty, IsString, IsNumber, Min, IsDateString } from 'class-validator';
import { UsersModel } from 'src/users/entities/users.entity';

export class CreateChallengeDto {
    @IsNotEmpty()
    @IsString()
    challengeName: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNumber()
    @Min(0)
    prize: number;

    @IsDateString()
    @IsNotEmpty()
    deadline: string;

    @IsNumber()
    @IsNotEmpty()
    writerId: number;
}
