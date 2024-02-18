// roadmap.dto.ts
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, isString } from 'class-validator';

export class SaveRoadMapsDto {

    @IsNumber()
    id: number

    @IsEmail()
    email: string;

    @IsNotEmpty()
    title: string;

    @IsOptional()
    category: string;

    // @IsNumber()
    // writerId: number; // 작성자의 ID
}
