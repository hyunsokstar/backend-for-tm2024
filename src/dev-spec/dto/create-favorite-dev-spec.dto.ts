import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Category } from '../entities/dev-spec.entity';

export class CreateFavoriteDevSpecDto {
    @IsNotEmpty()
    @IsString()
    language: string;

    @IsNotEmpty()
    @IsString()
    backend: string;

    @IsNotEmpty()
    @IsString()
    frontend: string;

    @IsNotEmpty()
    @IsString()
    orm: string;

    @IsNotEmpty()
    @IsString()
    css: string;
}
