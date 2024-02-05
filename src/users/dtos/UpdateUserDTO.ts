// dtoForUpdateUserList.ts
import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { GendersEnum, RolesEnum } from '../enums/roles.enum';

export class UpdateUserDTO {
    @IsInt()
    id: number;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    nickname?: string;

    @IsEnum(RolesEnum)
    @IsOptional()
    role?: RolesEnum;

    @IsEnum(GendersEnum)
    @IsOptional()
    gender?: GendersEnum;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsInt()
    @IsOptional()
    @Min(1)
    @Max(10)
    backEndLevel?: number | null;

    @IsInt()
    @IsOptional()
    @Min(1)
    @Max(10)
    frontEndLevel?: number | null;
}
