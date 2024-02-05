import { Controller, Post, Body, Param, UseGuards, Req, Get, NotFoundException } from '@nestjs/common';
import { TodoBriefingService } from '../todo_briefing.services';
import { AddTodoBriefingDto } from '../dtos/todo-briefing.dto';

@Controller('todos')
export class TodoBriefingController {
    constructor(private readonly todoBriefingService: TodoBriefingService) { }

    @Post(':todoId/create/briefing')
    async addBriefingToTodo(
        @Param('todoId') todoId: string, // todoId를 경로 파라미터로 받음
        @Body() addTodoBriefingDto: AddTodoBriefingDto,
        @Req() req: Request,
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