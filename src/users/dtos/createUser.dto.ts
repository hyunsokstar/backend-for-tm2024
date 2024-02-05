// createUser.dto.ts
import { IsEmail, IsEnum, IsPhoneNumber, IsString, Matches } from 'class-validator';
import { GendersEnum, RolesEnum } from "../enums/roles.enum";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    nickname: string;

    @IsString()
    password: string;

}
