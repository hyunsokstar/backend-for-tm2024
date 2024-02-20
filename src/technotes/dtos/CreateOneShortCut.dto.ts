import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOneShortCutDto {
    @IsNotEmpty()
    readonly shortcut: string;

    @IsNotEmpty()
    readonly description: string;

    @IsNotEmpty()
    readonly category: string;

    @IsNumber()
    readonly writerId: number;
}
