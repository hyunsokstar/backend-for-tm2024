import { IsString, IsOptional, IsInt } from 'class-validator';

export class TagDto {
    @IsInt()
    @IsOptional()
    id?: number;

    @IsString()
    name: string;
}
