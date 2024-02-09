// TodosController.ts
import { Controller, Post, Body, Get, Query, Delete, UseGuards, Req, Param } from '@nestjs/common';
import { TodosService } from '../todos.service';
import { DtoForCreateTodo } from '../dtos/createTodo.dto';
import { TodosModel } from '../entities/todos.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { SimpleCreateTodoDto } from '../dtos/SimpleCreateToDo.dto';
import { SimpleCreateSupplementTodoDto } from '../dtos/SimpleCreateSupplementToDo.dto';

@Controller('todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) { }

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

    @Get('forUser')
    async getTodoListForUserId(
        @Query('userId') userId,
        @Query('pageNum') pageNum = 1,
        @Query('perPage') perPage = 200,
        @Query('todoStatusOption') todoStatusOption,
    ): Promise<{ usersEmailInfo: string[], todoList: TodosModel[], totalCount: number, perPage: number }> {
        // console.log("요청 확인 for todo list ???");
        return this.todosService.getTodoListForUserId(pageNum, perPage, userId, todoStatusOption);
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
        @Req() req: Request,
    ) {
        const loginUser = req['user'];
        return this.todosService.deleteTodosForCheckedIds(checkedIds, loginUser);
    }

    // @UseGuards(AuthGuard)
    @Delete("/deleteSupplementaryTodosForCheckedRows") // DELETE 메서드로 새로운 엔드포인트를 정의합니다.
    async deleteSupplementaryTodosForCheckedIds(
        @Body('checkedIds') checkedIds: number[],
        @Req() req: Request,
    ) {
        const loginUser = req['user'];
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
    // body json 으로 받음 <=> manager(string), task(string), deadline: time, rowNum: number
    @Post("/simpleCreateTodo")
    async simpleCreateTodo(
        @Body() createTodoDto: SimpleCreateTodoDto,
    ) {
        console.log("createTodoDto : ", createTodoDto);

        await this.todosService.simpleCreateTodo(createTodoDto);
        return { message: "success", createTodoDto }
    }

    // @Delete, Body 로 todoId 받아서 todosService.deleteTodById 요청
    // 컨트롤러 함수 이름 deleteTodoById
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



}
