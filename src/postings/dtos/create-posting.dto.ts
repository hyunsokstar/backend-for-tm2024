// create-posting.dto.ts

import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePostingDto {

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;

    @IsNumber()
    userId: number;

}