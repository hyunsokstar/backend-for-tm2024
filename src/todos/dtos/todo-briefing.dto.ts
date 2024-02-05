// todo-briefing.dto.ts

import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { Position } from '../entities/todo_briefing.entity';

export enum TodoCategory {
    Main = 'main',
    Sub = 'sub',
}
export class AddTodoBriefingDto {
    @IsNotEmpty()
    content: string;

    @IsEnum(Position)
    position: Position;

    @IsNumber()
    userId: number;

    @IsEnum(TodoCategory)
    isMainOrSub: TodoCategory;
}

