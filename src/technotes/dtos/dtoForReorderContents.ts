import { IsString, IsNumber, isNumber } from 'class-validator';

export class dtoForReorderContents {

    @IsNumber()
    id: number;

    @IsNumber()
    order: number;

}
