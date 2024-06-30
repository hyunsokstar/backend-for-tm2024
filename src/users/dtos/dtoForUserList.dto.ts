import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsPhoneNumber, IsString, Matches, isNumber, isString } from 'class-validator';
import { GendersEnum, RolesEnum } from "../enums/roles.enum";

export class DtoForUserList {
    @IsNumber()
    id: number;

    @IsEmail()
    email: string;

    @IsString()
    nickname: string;

    @IsEnum(RolesEnum)
    role: RolesEnum;

    @IsEnum(GendersEnum)
    gender: GendersEnum;

    @Matches(/^010-\d{4}-\d{4}$/, { message: '휴대폰 번호 형식을 지켜주세요.' })
    phoneNumber: string;

    @IsNumber()
    backEndLevel: number | null;

    @IsNumber()
    frontEndLevel: number | null;

    @IsString()
    profileImage: string;

    @IsBoolean()
    isOnline: boolean;

    @IsOptional()
    @IsString()
    currentTask: string | null;

    @IsNumber()
    currentTaskProgressPercent: number;

    @IsEnum(['struggling', 'offroad', 'ninja', 'cheetah', 'rocket'])
    performanceLevel: string;
}
