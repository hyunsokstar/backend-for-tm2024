import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSubShortCutDto {
    @IsNotEmpty()
    shortcut: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    category?: string;

    @IsNotEmpty()
    parentId: number; // 부모 shortcut의 ID
}
