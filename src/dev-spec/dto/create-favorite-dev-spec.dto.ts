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

    @IsNotEmpty()
    @IsString()
    app: string;

}


// update-favorite-dev-spec.dto.ts
export class UpdateFavoriteDevSpecBoilerPlateInfoDto {
    @IsNotEmpty()
    @IsString()
    authGithub: string;

    @IsNotEmpty()
    @IsString()
    authNote: string;

    @IsNotEmpty()
    @IsString()
    boardGithub: string;

    @IsNotEmpty()
    @IsString()
    boardNote: string;

    @IsNotEmpty()
    @IsString()
    chatGithub: string;

    @IsNotEmpty()
    @IsString()
    chatNote: string;

    @IsNotEmpty()
    @IsString()
    paymentGithub: string;

    @IsNotEmpty()
    @IsString()
    paymentNote: string;

    @IsNotEmpty()
    @IsString()
    devOpsGithub: string;

    @IsNotEmpty()
    @IsString()
    devOpsNote: string;
}

