import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Position } from '../entities/sub-challenge-briefings.entity';

export class CreateBriefingForSubChallengeDto {
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    @IsEnum(Position)
    position: Position;

    @IsOptional()
    refImage: string;
}
