// src\dev-battle\dto\add-todo-for-dev-battle.dto.ts

// AddTodoForDevBattleDto
// src/dev-battle/dto/add-todo-for-dev-battle.dto.ts
import { IsNotEmpty, IsOptional, IsDate, IsDateString } from 'class-validator';

export class AddTodoForDevBattleDto {
    @IsNotEmpty()
    title: string;

    @IsDateString()
    dueDate?: any;

    @IsOptional()
    description?: string;
}
