// dtoForCreateTechNote.dto.ts 파일

import { IsString, IsNumber } from 'class-validator';

export class DtoForCreateTechNote {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    category: string;

    @IsNumber()
    writerId: number;
}
