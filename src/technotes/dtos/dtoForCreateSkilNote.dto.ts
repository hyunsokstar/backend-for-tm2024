import { IsString, IsNumber } from 'class-validator';

export class dtoForCreateSkilNote {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    category: string;

    @IsString()
    email: string;

    @IsNumber()
    techNoteId: number;
}
