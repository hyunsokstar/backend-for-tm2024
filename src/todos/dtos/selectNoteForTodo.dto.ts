// select-note-for-todo.dto.ts

import { IsInt, IsNumber } from 'class-validator';

export class SelectNoteForTodoDto {
    @IsNumber()
    toDoId: number;

    @IsNumber()
    skilNoteId: number;
}
