import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

export class UpdateFavoriteDevSpecBoilerPlateInfoDto {
    @IsString()
    @IsOptional()
    authGithub: string | null;

    @IsString()
    @IsOptional()
    authNote: string | null;

    @IsString()
    @IsOptional()
    boardGithub: string | null;

    @IsString()
    @IsOptional()
    boardNote: string | null;

    @IsString()
    @IsOptional()
    chatGithub: string | null;

    @IsString()
    @IsOptional()
    chatNote: string | null;

    @IsString()
    @IsOptional()
    paymentGithub: string | null;

    @IsString()
    @IsOptional()
    paymentNote: string | null;

    @IsString()
    @IsOptional()
    devOpsGithub: string | null;

    @IsString()
    @IsOptional()
    devOpsNote: string | null;

    @IsString()
    @IsOptional()
    figma: string | null;
}


