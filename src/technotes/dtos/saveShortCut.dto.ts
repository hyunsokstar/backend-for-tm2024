import { IsNotEmpty, IsOptional, IsString, IsNumber, IsEmail } from 'class-validator';

export class SaveShortCutsDto {
    @IsNumber()
    id: number;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    shortcut: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    category: string;

}