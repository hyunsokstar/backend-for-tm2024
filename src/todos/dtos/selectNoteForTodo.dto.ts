// select-note-for-todo.dto.ts

import { IsInt, IsNumber } from 'class-validator';

export class SelectNoteForTodoDto {
    @IsNumber()
    todoId: number;

    @IsNumber()
    skilNoteId: number;
}
