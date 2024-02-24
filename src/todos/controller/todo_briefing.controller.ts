import { Controller, Post, Body, Param, UseGuards, Req, Get, NotFoundException } from '@nestjs/common';
import { TodoBriefingService } from '../todo_briefing.services';
import { AddTodoBriefingDto } from '../dtos/todo-briefing.dto';
import { SelectNoteForTodoDto } from '../dtos/selectNoteForTodo.dto';
import { SelectManagerForUnsignedTodoDto } from '../dtos/SelectManagerDto.dto';

@Controller('todos')
export class TodoBriefingController {
    constructor(private readonly todoBriefingService: TodoBriefingService) { }

    @Post('selectManagerForUnsignedTask')
    async selectManagerForUnsginedTask(
        @Body() selectNoteForTodoDto: SelectManagerForUnsignedTodoDto, // 요청 본문 데이터
    ): Promise<any> {
        return this.todoBriefingService.selectManagerForUnsginedTask(selectNoteForTodoDto);
    }

    @Post(':todoId/create/briefing')
    async addBriefingToTodo(
        @Param('todoId') todoId: string, // todoId를 경로 파라미터로 받음
        @Body() addTodoBriefingDto: AddTodoBriefingDto,
        @Req() req,
    ): Promise<any> {
        return this.todoBriefingService.addTodoBriefing(todoId, addTodoBriefingDto);
    }

    @Get(':todoId/briefings')
    async getAllTodoBriefingsByTodoId(@Param('todoId') todoId: number): Promise<any> {
        try {
            const todoBriefings = await this.todoBriefingService.getAllTodoBriefingsByTodoId(todoId);
            return { success: true, todoBriefings };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }

}