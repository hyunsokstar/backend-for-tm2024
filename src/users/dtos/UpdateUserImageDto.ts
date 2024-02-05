import { IsEmail, IsString } from "class-validator";

export class UpdateUserImageDto {
    @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
    email: string;

    @IsString({ message: '문자열 형식이 아닙니다.' })
    image: string;
}
