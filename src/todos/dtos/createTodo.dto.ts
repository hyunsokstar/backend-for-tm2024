// DtoForCreateTodo.ts
import { IsNotEmpty, IsString, IsEnum, IsInt, Min, Max, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { TodoStatus } from '../entities/todos.entity';

export class DtoForCreateTodo {
    @IsNotEmpty()
    @IsString()
    task: string;

    @IsOptional()
    @IsString()
    details: string;

    @IsNotEmpty()
    @IsEnum(TodoStatus)
    status: TodoStatus;

    @IsOptional()
    @IsDateString()
    startTime: Date;

    @IsOptional()
    @IsDateString()
    deadline: Date;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(5)
    priority: number;

    @IsNotEmpty()
    @IsNumber()
    supervisorId: number;

    @IsNotEmpty()
    managerId: number; // managerId로 수정
}

