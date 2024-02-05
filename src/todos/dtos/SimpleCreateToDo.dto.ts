// DtoForCreateTodo.ts
import { IsNotEmpty, IsString, IsEnum, IsInt, Min, Max, IsDateString, IsOptional, IsNumber, isString, isNumber } from 'class-validator';

export class SimpleCreateTodoDto {

    @IsNotEmpty()
    @IsString()
    task: string;

    @IsOptional()
    @IsDateString()
    deadline: Date;

    @IsNotEmpty()
    @IsString()
    email: string; // managerId로 수정

    @IsNotEmpty()
    rowNum: number; // managerId로 수정

    @IsString()
    todoStatusOption: "idea" | "uncompleted" | "completed"
}