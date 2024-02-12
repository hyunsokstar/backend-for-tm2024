import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class MultiUpdateTodoDto {
    @IsArray()
    selectedRowIdsArray: number[];

    @IsDateString()
    @IsOptional()
    defaultDeadLine: Date;

    @IsString()
    defaultTodoStatus: string;

    @IsString()
    @IsOptional()
    defaultUserEmail: string;
}
