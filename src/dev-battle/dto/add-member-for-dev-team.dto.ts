// src\dev-battle\dto\add-member-for-dev-team.dto.ts
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class AddMemberForDevTeamDto {
    @IsNotEmpty()
    @IsEnum(['leader', 'member'])
    position: 'leader' | 'member';
}
