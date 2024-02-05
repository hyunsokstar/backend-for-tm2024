import { IsString, IsNumber, IsOptional } from 'class-validator';

export class dtoForCreateSkilNoteContent {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    file?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsOptional()
    createdAt?: Date;

}
