import { IsNotEmpty, IsString } from 'class-validator';

export class AddTeamToDevBattleDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;
}
