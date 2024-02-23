// todo-briefing.dto.ts

import { IsNotEmpty, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Position } from '../entities/todo_briefing.entity';

export enum TodoCategory {
    Main = 'main',
    Sub = 'sub',
}
export class AddTodoBriefingDto {
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsString()
    refImage: string | null;

    @IsEnum(Position)
    position: Position;

    @IsNumber()
    userId: number;

    @IsEnum(TodoCategory)
    isMainOrSub: TodoCategory;
}

