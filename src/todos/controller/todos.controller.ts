// TodosController.ts
import { Controller, Post, Body, Get, Query, Delete, UseGuards, Req, Param } from '@nestjs/common';
import { TodosService } from '../todos.service';
import { DtoForCreateTodo } from '../dtos/createTodo.dto';
import { TodosModel } from '../entities/todos.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { SimpleCreateTodoDto } from '../dtos/SimpleCreateToDo.dto';
import { SimpleCreateSupplementTodoDto } from '../dtos/SimpleCreateSupplementToDo.dto';
import { MultiUpdateTodoDto } from '../dtos/multi-update-todo.dto';

@Controller('todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) { }

    @Get('/user/:userId/completed')
    async getUserCompletedTodoList(
        @Param('userId') userId: number,
        @Query('pageNum') pageNum = 1,
        @Query('perPage') perPage = 20,
    ): Promise<{ todoList: TodosModel[], totalCount: number, perPage: number }> {
        return this.todosService.getUserCompletedTodoList(userId, pageNum, perPage);
    }

    @Get('completed')
    async getCompletedTodoList(
        @Query('pageNum') pageNum = 1,
        @Query('perPage') perPage = 20,
        @Req() req
    ): Promise<{ usersEmailInfo: string[], todoList: TodosModel[], totalCount: number, perPage: number }> {
        return this.todosService.getCompletedTodoList(pageNum, perPage);
    }

    @Get('uncompleted')
    async getUncompletedTodoList(
        @Query('pageNum') pageNum = 1,
        @Query('perPage') perPage = 200,
        @Query('todoStatusOption') todoStatusOption,
        @Req() req
    ): Promise<{ usersEmailInfo: string[], todoList: TodosModel[], totalCount: number, perPage: number }> {
        // console.log("req.user : ", req.user);
        return this.todosService.getUncompletedTodoList(pageNum, perPage, todoStatusOption);
    }

    @Get('forUser')
    async getTodoListForUserId(
        @Query('userId') userId,
        @Query('pageNum') pageNum = 1,
        @Query('perPage') perPage = 200,
        @Query('todoStatusOption') todoStatusOption,
        @Req() req
    ): Promise<{ usersEmailInfo: string[], todoList: TodosModel[], totalCount: number, perPage: number }> {
        console.log("userId ?????????? : ", userId);
        return this.todosService.getTodoListForUserId(pageNum, perPage, userId, todoStatusOption);
    }

    @Post()
    async createTodo(@Body() createTodoDto: DtoForCreateTodo) {
        return this.todosService.create(createTodoDto);
    }

    @Get('')
    async getTodoList(
        @Query('pageNum') pageNum = 1,
        @Query('perPage') perPage = 200,
    ): Promise<{ usersEmailInfo: string[], todoList: TodosModel[], totalCount: number, perPage: number }> {
        return this.todosService.getTodosList(pageNum, perPage);
    }




    @Post('saveTodos') // API 엔드포인트 추가
    async saveTodos(@Body() todoRowsForSave: any) {
        console.log("todoRowsForSave 메인 todo save 시도 !!! : ", todoRowsForSave);
        return this.todosService.saveTodos(todoRowsForSave);
    }

    @Post('saveSupplementaryTodos') // API 엔드포인트 추가
    async saveSupplementaryTodos(
        @Body() requestBody: any // 요청 본문 전체를 하나의 객체로 받음
    ) {
        const { supplementaryTodoRowsForSave, parentTodoId } = requestBody;

        console.log("parentTodoId ??? ", parentTodoId);
        return this.todosService.saveSupplementaryTodos(supplementaryTodoRowsForSave, parentTodoId);
    }

    @UseGuards(AuthGuard)
    @Delete("/deleteTodosForCheckedRows") // DELETE 메서드로 새로운 엔드포인트를 정의합니다.
    async deleteTodosForCheckedIds(
        @Body('checkedIds') checkedIds: number[],
        @Req() req,
    ) {
        const loginUser = req.user;
        return this.todosService.deleteTodosForCheckedIds(checkedIds, loginUser);
    }

    @Delete("/deleteSupplementaryTodosForCheckedRows") // DELETE 메서드로 새로운 엔드포인트를 정의합니다.
    async deleteSupplementaryTodosForCheckedIds(
        @Body('checkedIds') checkedIds: number[],
        @Req() req,
    ) {
        const loginUser = req.user;

        console.log("삭제 supplementary todo check ");


        return this.todosService.deleteSupplementaryTodosForCheckedIds(checkedIds, loginUser);
    }

    @Post(":todoId/updateRefSkilNote")
    async UpdateRefSkilNoteForTodo(
        @Param('todoId') todoId: number,
        @Body('isMainOrSub') isMainOrSub: "main" | "sub"
    ) {
        return this.todosService.UpdateRefSkilNoteForTodo(todoId, isMainOrSub)
    }

    @Post('/selectSkilNoteForTodo')
    async selectSkilNoteForTodo(@Body() { toDoId, skilNoteId, isMainOrSub }: any) {
        // console.log('toDoId at selectSkilNoteForTodo :', toDoId);
        return this.todosService.SelectSkilNoteForToDo(toDoId, skilNoteId, isMainOrSub)
    }

    @Get('loadMoreTodosForScroll')
    async loadMoreTodosForScroll(
        @Query('lastId') lastId = 1,
    ): Promise<{ todoList: TodosModel[], totalCount: number, isEnd: boolean }> {
        return this.todosService.loadMoreTodosForScroll(lastId);
    }

    // post, "/simpleInsertTodo"
    @Post("/simpleCreateTodo")
    async simpleCreateTodo(
        @Body() createTodoDto: SimpleCreateTodoDto,
    ) {
        console.log("createTodoDto : ", createTodoDto);
        await this.todosService.simpleCreateTodo(createTodoDto);
        return { message: "success", createTodoDto }
    }

    // @Delete, Body 로 todoId 받아서 todosService.deleteTodById 요청
    @Delete("deleteTodoById")
    async deleteTodoById(
        @Body('todoId') todoId: number,
    ) {
        return this.todosService.deleteTodoById(todoId);
    }

    @Post("/simpleCreateSupplementaryTodo")
    async simpleCreateSupplementaryTodo(
        @Body() supplementTodoDto: SimpleCreateSupplementTodoDto,
    ) {
        console.log("simpleCreateSupplementaryTodo : ", supplementTodoDto);
        // 서비스 메서드 호출
        const { createdTodos, count } = await this.todosService.simpleCreateSupplementaryTodo(supplementTodoDto);

        // 응답 객체에 결과 포함하여 반환
        return { message: "success", createdTodos, count };
    }

    @Post('/multiUpdateTodoRowsForChecked')
    async multiUpdateTodoRowsForChecked(@Body() dtoForMultiUpdateTodoRowsForChecked: MultiUpdateTodoDto, @Req() req) {
        console.log("dto check ??? : ", dtoForMultiUpdateTodoRowsForChecked);
        // console.log("req.user : ", req.user);
        console.log("multi update check");


        const result = await this.todosService.multiUpdateTodoRowsForChecked(dtoForMultiUpdateTodoRowsForChecked);

        return {
            message: "multi update for todos for checked success",
            result
        }
    }

    @Post('/multiUpdateSupplementaryTodoRowsForChecked')
    async multiUpdateSupplementaryTodoRowsForChecked(@Body() dtoForMultiUpdateSupplementaryTodoRowsForChecked: MultiUpdateTodoDto, @Req() req) {
        console.log("dto check ??? : ", dtoForMultiUpdateSupplementaryTodoRowsForChecked);


        const result = await this.todosService.multiUpdateSupplementaryTodoRowsForChecked(dtoForMultiUpdateSupplementaryTodoRowsForChecked);

        return {
            message: "multi update for todos for checked success",
            result
        }
    }



}
