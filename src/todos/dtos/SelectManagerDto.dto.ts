import { IsNumber, IsNotEmpty } from 'class-validator';

export class SelectManagerForUnsignedTodoDto {
    @IsNotEmpty()
    @IsNumber()
    todoId: number;

    @IsNotEmpty()
    @IsNumber()
    writerId: number;
}
