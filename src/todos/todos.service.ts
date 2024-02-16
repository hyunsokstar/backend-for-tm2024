import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import { TodoStatus, TodosModel } from './entities/todos.entity';
import { DtoForCreateTodo } from './dtos/createTodo.dto';
import { UsersModel } from 'src/users/entities/users.entity';
import { SkilNotesModel } from 'src/technotes/entities/skilnotes.entity';
import { SimpleCreateTodoDto } from './dtos/SimpleCreateToDo.dto';
import { SupplementaryTodosModel } from './entities/supplementary_todos.entity';
import { SimpleCreateSupplementTodoDto } from './dtos/SimpleCreateSupplementToDo.dto';
import { SkilNoteContentsModel } from 'src/technotes/entities/skilnote_contents.entity';
import { MultiUpdateTodoDto } from './dtos/multi-update-todo.dto';

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(TodosModel)
        private readonly todosRepository: Repository<TodosModel>,

        @InjectRepository(SupplementaryTodosModel)
        private readonly supplementaryTodosRepo: Repository<SupplementaryTodosModel>,

        @InjectRepository(UsersModel) // UsersModel의 Repository를 주입합니다.
        private readonly usersRepository: Repository<UsersModel>,

        @InjectRepository(SkilNotesModel) // UsersModel의 Repository를 주입합니다.
        private readonly skilNoteRepo: Repository<SkilNotesModel>,

        @InjectRepository(SkilNoteContentsModel) // UsersModel의 Repository를 주입합니다.
        private readonly skilNoteContentsRepo: Repository<SkilNoteContentsModel>,

    ) { }

    // 1122
    async multiUpdateTodoRowsForChecked(dto: MultiUpdateTodoDto) {
        const {
            selectedRowIdsArray,
            defaultDeadLine,
            defaultTodoStatus,
            defaultUserEmail
        } = dto;

        // 사용자 정보 가져오기
        const manager = await this.usersRepository.findOne({ where: { email: defaultUserEmail } });

        let todoStatusOption;

        if (defaultTodoStatus === "idea") {
            todoStatusOption = TodoStatus.IDEA
        } else if (defaultTodoStatus === "ready") {
            todoStatusOption = TodoStatus.READY
        } else if (defaultTodoStatus === "progress") {
            todoStatusOption = TodoStatus.PROGRESS
        } else if (defaultTodoStatus === "testing") {
            todoStatusOption = TodoStatus.TESTING
        } else if (defaultTodoStatus === "completed") {
            todoStatusOption = TodoStatus.COMPLETED
        }

        // 선택된 각 Todo ID에 대해 업데이트 수행
        for (const todoId of selectedRowIdsArray) {
            // 해당하는 Todo를 찾습니다.
            const todoToUpdate = await this.todosRepository.findOne({ where: { id: todoId } });

            // 해당하는 Todo가 없으면 NotFoundException을 throw합니다.
            if (!todoToUpdate) {
                throw new NotFoundException(`Todo with ID ${todoId} not found.`);
            }

            // 만약에 업데이트할 값이 존재한다면, 해당 값으로 업데이트합니다.
            if (defaultTodoStatus !== null && defaultTodoStatus !== "") {
                todoToUpdate.status = todoStatusOption;
            }
            if (defaultDeadLine !== null && defaultDeadLine !== null) {
                todoToUpdate.deadline = defaultDeadLine;
            }
            if (manager) {
                todoToUpdate.manager = manager;
            }

            // Todo를 저장하여 업데이트합니다.
            await this.todosRepository.save(todoToUpdate);
        }

        return dto;
    }

    async multiUpdateSupplementaryTodoRowsForChecked(dto: MultiUpdateTodoDto) {
        const {
            selectedRowIdsArray,
            defaultDeadLine,
            defaultTodoStatus,
            defaultUserEmail
        } = dto;

        // 사용자 정보 가져오기
        const manager = await this.usersRepository.findOne({ where: { email: defaultUserEmail } });

        let todoStatusOption;

        if (defaultTodoStatus === "idea") {
            todoStatusOption = TodoStatus.IDEA
        } else if (defaultTodoStatus === "ready") {
            todoStatusOption = TodoStatus.READY
        } else if (defaultTodoStatus === "progress") {
            todoStatusOption = TodoStatus.PROGRESS
        } else if (defaultTodoStatus === "testing") {
            todoStatusOption = TodoStatus.TESTING
        } else if (defaultTodoStatus === "completed") {
            todoStatusOption = TodoStatus.COMPLETED
        }

        // 선택된 각 Todo ID에 대해 업데이트 수행
        for (const todoId of selectedRowIdsArray) {
            // 해당하는 Todo를 찾습니다.
            const todoToUpdate = await this.supplementaryTodosRepo.findOne({ where: { id: todoId } });

            // 해당하는 Todo가 없으면 NotFoundException을 throw합니다.
            if (!todoToUpdate) {
                throw new NotFoundException(`Todo with ID ${todoId} not found.`);
            }

            // 만약에 업데이트할 값이 존재한다면, 해당 값으로 업데이트합니다.
            if (defaultTodoStatus !== null && defaultTodoStatus !== "") {
                todoToUpdate.status = todoStatusOption;
            }
            if (defaultDeadLine !== null && defaultDeadLine !== null) {
                todoToUpdate.deadline = defaultDeadLine;
            }
            if (manager) {
                todoToUpdate.manager = manager;
            }

            // Todo를 저장하여 업데이트합니다.
            await this.supplementaryTodosRepo.save(todoToUpdate);
        }

        return dto;
    }

    async deleteTodoById(todoId: any) {
        // 주어진 todoId로 할 일을 찾습니다.
        const todo = await this.todosRepository.findOne({ where: { id: todoId } });

        // 만약 할 일이 없다면 오류를 반환합니다.
        if (!todo) {
            throw new NotFoundException(`Todo with ID ${todoId} not found`);
        }

        // 할 일을 삭제합니다.
        await this.todosRepository.remove(todo);

        return { message: `Deleted Todo with ID: ${todoId}` };
    }

    async SelectSkilNoteForToDo(toDoId: number, skilNoteId: number, isMainOrSub: "main" | "sub") {

        console.log("todoId ??? :", toDoId);
        console.log("skilNoteId ??? :", skilNoteId);
        console.log("isMainOrSub ??? :", isMainOrSub);

        if (isMainOrSub === "main") {
            const todo = await this.todosRepository.findOne({ where: { id: toDoId }, relations: ["manager"] });
            const skilNoteObj = await this.skilNoteRepo.findOne({ where: { id: skilNoteId } })

            if (!todo || !skilNoteObj) {
                throw new NotFoundException(`Todo with ID ${toDoId} or SkilNote ID ${skilNoteId} not found`);
            }

            todo.skilNoteUrl = `/Note/SkilNoteContents/${skilNoteObj.id}/1`
            todo.refSkilNoteId = skilNoteObj.id

            await this.todosRepository.save(todo);

            return {
                message: "succes update todo's ref skil note"
            }
        } else {
            const todo = await this.supplementaryTodosRepo.findOne({ where: { id: toDoId }, relations: ["manager"] });
            const skilNoteObj = await this.skilNoteRepo.findOne({ where: { id: skilNoteId } })

            if (!todo || !skilNoteObj) {
                throw new NotFoundException(`Todo with ID ${toDoId} or SkilNote ID ${skilNoteId} not found`);
            }

            todo.skilNoteUrl = `/Note/SkilNoteContents/${skilNoteObj.id}/1`
            todo.refSkilNoteId = skilNoteObj.id

            await this.supplementaryTodosRepo.save(todo);

            return {
                message: "succes update todo's ref skil note"
            }
        }


    }

    async UpdateRefSkilNoteForTodo(todoId: number, isMainOrSub: "main" | "sub") {

        if (isMainOrSub === "main") {
            const todo = await this.todosRepository.findOne({ where: { id: todoId }, relations: ["manager"] });

            if (!todo) {
                throw new NotFoundException(`Todo with ID ${todoId} not found`);
            }
            if (todo.skilNoteUrl === null) {
                // SkilNote를 생성
                const skilNoteObj = this.skilNoteRepo.create({
                    title: todo.task,  // todo.task를 title로 설정
                    description: todo.task,  // todo.task를 description으로 설정
                    category: "refNote",  // 카테고리 설정 (예: "refNote")
                    writer: todo.manager,  // Todo와 연결된 User를 writer로 설정 (이 예제에서는 Todo에 user 필드가 있어야 함)
                });

                const createdSkilNote = await this.skilNoteRepo.save(skilNoteObj);

                todo.skilNoteUrl = `/Note/SkilNoteContents/${skilNoteObj.id}/1`
                todo.refSkilNoteId = skilNoteObj.id
                await this.todosRepository.save(todo);
                return createdSkilNote;
            } else {
                // SkilNote가 이미 연결되어 있는 경우 처리
                // 기존 SkilNote 삭제
                await this.skilNoteRepo.delete(todo.refSkilNoteId);

                // refSkilNoteId 초기화
                todo.skilNoteUrl = "";
                todo.refSkilNoteId = null;

                // Todos 엔티티 저장
                await this.todosRepository.save(todo);

                return {
                    message: "successfully updated todo's ref skil note"
                };
            }
        } else {

            console.log("ref note 생성 시도 at service check !", isMainOrSub);


            const todo = await this.supplementaryTodosRepo.findOne({ where: { id: todoId }, relations: ["manager"] });

            if (!todo) {
                throw new NotFoundException(`Todo with ID ${todoId} not found`);
            }
            if (todo.skilNoteUrl === null) {
                // SkilNote를 생성
                const skilNoteObj = this.skilNoteRepo.create({
                    title: todo.task,  // todo.task를 title로 설정
                    description: todo.task,  // todo.task를 description으로 설정
                    category: "refNote",  // 카테고리 설정 (예: "refNote")
                    writer: todo.manager,  // Todo와 연결된 User를 writer로 설정 (이 예제에서는 Todo에 user 필드가 있어야 함)
                });

                const createdSkilNote = await this.skilNoteRepo.save(skilNoteObj);

                todo.skilNoteUrl = `/Note/SkilNoteContents/${skilNoteObj.id}/1`
                todo.refSkilNoteId = skilNoteObj.id
                await this.supplementaryTodosRepo.save(todo);
                return createdSkilNote;
            } else {
                // SkilNote가 이미 연결되어 있는 경우 처리
                // 기존 SkilNote 삭제
                await this.supplementaryTodosRepo.delete(todo.refSkilNoteId);

                // refSkilNoteId 초기화
                todo.skilNoteUrl = "";
                todo.refSkilNoteId = null;

                // Todos 엔티티 저장
                await this.supplementaryTodosRepo.save(todo);

                return {
                    message: "successfully updated todo's ref skil note"
                };
            }
        }

    }


    async saveTodos(todoRowsForSave: any[]): Promise<any> {
        console.log("todoRowsForSave : ", todoRowsForSave);
        console.log("todoRowsForSave.length : ", todoRowsForSave.length);
        let count = 0;

        for (const todo of todoRowsForSave) {
            const { id, email, nickname, task, ...data } = todo;
            const startedAt = new Date(todo.startTime).getTime();
            const currentDeadline = new Date().getTime();
            const timeDifferenceInMilliseconds = currentDeadline - startedAt;
            const hoursDifference = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60)); // 시간
            const minutesDifference = Math.floor((timeDifferenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)); // 분

            // 이메일로 해당하는 유저를 찾음
            const manager = await this.usersRepository.findOne({ where: { email: todo.email } });

            if (!manager) {
                throw new NotFoundException('User not found email is required !!');
            }

            if (manager) {
                if (id) {
                    const existingTodo = await this.todosRepository.findOne({ where: { id: id } }); // 변경된 부분

                    if (existingTodo) {

                        if (todo.status === "ready") {
                            count += 1
                            console.log("update check 111111111111111111111 ready");
                            await this.todosRepository.update(id, {
                                manager: manager, // 찾은 유저 객체를 할당
                                task: todo.task,
                                status: todo.status,
                                startTime: new Date,
                                // deadline: null,
                                elapsedTime: null,
                            });
                        }
                        else if (todo.status === "progress") {
                            count += 1
                            console.log("update check 111111111111111111111 progress");
                            await this.todosRepository.update(id, {
                                manager: manager, // 찾은 유저 객체를 할당
                                task: todo.task,
                                status: todo.status,
                                startTime: new Date(), // 현재 시간 할당
                                // deadline: null,
                                elapsedTime: null,
                            });
                        }
                        else if (todo.status === "testing") {
                            await this.todosRepository.update(id, {
                                manager: manager, // 찾은 유저 객체를 할당
                                task: todo.task,
                                status: todo.status,
                                // deadline: null,
                                elapsedTime: null,
                            });
                        }

                        else if (todo.status === "complete") {
                            await this.todosRepository.update(id, {
                                manager: manager,
                                task: todo.task,
                                status: todo.status,
                                completedAt: new Date(),
                                elapsedTime: hoursDifference + "시간 " + minutesDifference + "분",
                            });
                        }

                        else {
                            count += 1
                            console.log("update check 2222222222");

                            await this.todosRepository.update(id, {
                                manager: manager,
                                task: todo.task,
                                status: todo.status,
                            });
                        }
                    } else {
                        console.log(`ID '${id}'에 해당하는 Todo를 찾을 수 없습니다. ${count}`);
                        console.log("todo : ", todo);
                        count += 1

                        await this.todosRepository.save({
                            manager: manager,
                            task: todo.task,
                            status: todo.READY,
                            startTime: new Date(),
                            deadline: todo.deadline
                        });
                        // return { message: 'New Todo created successfully' };
                    }
                } else {
                    console.log(`ID가 없습니다.`);
                }
            } else {
                console.log(`유저 이메일 '${todo.email}'을(를) 찾을 수 없습니다.`);
            }
        }
        return { message: `Todos saved successfully ${count}` };

    }

    async saveSupplementaryTodos(supplementTodoRowsForSave: any[], parentTodoId): Promise<any> {
        console.log("supplementTodoRowsForSave ??? : ", supplementTodoRowsForSave);
        console.log("supplementTodoRowsForSave.length ???: ", supplementTodoRowsForSave.length);

        let count = 0;

        for (const todo of supplementTodoRowsForSave) {
            const { id, email, nickname, task, ...data } = todo;
            console.log("todo.email : ", todo.email);

            const startedAt = new Date(todo.startTime).getTime();
            const currentDeadline = new Date().getTime();
            console.log("currentDeadline : ", currentDeadline);
            console.log("startedAt : ", startedAt);
            const timeDifferenceInMilliseconds = currentDeadline - startedAt;
            const hoursDifference = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60)); // 시간
            const minutesDifference = Math.floor((timeDifferenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)); // 분

            // 이메일로 해당하는 유저를 찾음
            const manager = await this.usersRepository.findOne({ where: { email: todo.email } });
            console.log("manager : ", manager);

            if (!manager) {
                throw new NotFoundException('User not found email is required !!');
            }

            if (manager) {
                if (id) {
                    const parentTodoObj = await this.todosRepository.findOne({ where: { id: parentTodoId } }); // 변경된 부분
                    const existingTodo = await this.supplementaryTodosRepo.findOne({ where: { id: id } }); // 변경된 부분
                    if (existingTodo) {

                        if (todo.status === "ready") {
                            count += 1
                            console.log("update check 111111111111111111111");
                            await this.supplementaryTodosRepo.update(id, {
                                manager: manager, // 찾은 유저 객체를 할당
                                task: todo.task,
                                status: todo.status,
                                startTime: new Date,
                                // deadline: null,
                                elapsedTime: null,
                            });
                        }
                        else if (todo.status === "progress") {
                            count += 1
                            console.log("update check 111111111111111111111");
                            await this.supplementaryTodosRepo.update(id, {
                                manager: manager, // 찾은 유저 객체를 할당
                                task: todo.task,
                                status: todo.status,
                                startTime: new Date(), // 현재 시간 할당
                                // deadline: null,
                                elapsedTime: null,
                            });
                        }
                        else if (todo.status === "testing") {
                            await this.supplementaryTodosRepo.update(id, {
                                manager: manager, // 찾은 유저 객체를 할당
                                task: todo.task,
                                status: todo.status,
                                // deadline: null,
                                elapsedTime: null,
                            });
                        }

                        else if (todo.status === "complete") {
                            await this.supplementaryTodosRepo.update(id, {
                                manager: manager,
                                task: todo.task,
                                status: todo.status,
                                completedAt: new Date(),
                                elapsedTime: hoursDifference + "시간 " + minutesDifference + "분",
                            });
                        }

                        else {
                            count += 1
                            console.log("update check 2222222222");

                            await this.supplementaryTodosRepo.update(id, {
                                manager: manager,
                                task: todo.task,
                                status: todo.status,
                            });
                        }
                    } else {
                        console.log(`ID '${id}'에 해당하는 Todo를 찾을 수 없습니다. ${count}`);
                        console.log("supplement todo 생성 하겠습니다 ??? : ", todo);
                        count += 1

                        await this.supplementaryTodosRepo.save({
                            manager: manager,
                            task: todo.task,
                            status: todo.READY,
                            startTime: new Date(),
                            deadline: todo.deadline,
                            todo: parentTodoObj
                        });
                        // return { message: 'New Todo created successfully' };
                    }
                } else {
                    console.log("생성 못함1");

                    console.log(`ID가 없습니다.`);
                }
            } else {
                console.log("생성 못함2");

                console.log(`유저 이메일 '${todo.email}'을(를) 찾을 수 없습니다.`);
            }
        }
        return { message: `Todos saved successfully ${count}` };

    }


    async create(createTodoDto: DtoForCreateTodo): Promise<TodosModel> {
        const { task, details, status, startTime, deadline, priority, supervisorId, managerId } = createTodoDto;

        const managerEntity = await this.usersRepository.findOne({
            where: {
                id: managerId
            }
        });

        const superVisorEntity = await this.usersRepository.findOne({
            where: {
                id: supervisorId
            }
        });

        const todo = this.todosRepository.create({
            task,
            details,
            status,
            startTime,
            deadline,
            priority,
            manager: managerEntity,
            supervisor: superVisorEntity,
        });

        return this.todosRepository.save(todo);
    }



    async getTodosList(
        pageNum: number = 1,
        perPage: number = 20
    ): Promise<{
        todoList: TodosModel[],
        totalCount: number,
        perPage: number,
        usersEmailInfo: string[]
    }> {

        const userEmailList = await this.usersRepository
            .createQueryBuilder('user')
            .select('user.email AS user_email')
            .getRawMany();

        const usersEmailInfo = userEmailList.map(item => item.user_email);
        console.log("usersEmailInfo : ", usersEmailInfo);


        // manager.email이 같은 항목들을 연달아 출력하기 위해 메인 쿼리에서 subQuery를 활용합니다.
        const todoList = await this.todosRepository
            .createQueryBuilder('todo')
            .leftJoinAndSelect('todo.manager', 'manager')
            .leftJoinAndSelect('todo.supervisor', 'supervisor')
            .leftJoinAndSelect('todo.briefings', 'briefings')
            .leftJoinAndSelect('todo.supplementaryTodos', 'supplementaryTodos')
            // .leftJoinAndSelect('todo.supplementaryTodos.manager', 'manager')
            .orderBy('manager.email')
            .addOrderBy('todo.id', 'DESC')
            .getMany();

        const totalCount = todoList.length;

        return {
            usersEmailInfo,
            todoList,
            totalCount,
            perPage
        };
    }


    async getTodoListForUserId(
        pageNum: number = 1,
        perPage: number = 20,
        userId: number,
        todoStatusOption: "all_uncompleted" | "all_completed" | "idea" | "uncompleted" | "completed"
    ): Promise<{
        todoList: TodosModel[],
        totalCount: number,
        perPage: number,
        usersEmailInfo: string[]
    }> {
        const userEmailList = await this.usersRepository
            .createQueryBuilder('user')
            .select('user.email AS user_email')
            .getRawMany();

        const usersEmailInfo = userEmailList.map(item => item.user_email);

        let todoStatus: TodoStatus[] = [TodoStatus.IDEA, TodoStatus.COMPLETED]; // 기본적으로 IDEA와 COMPLETED를 제외하도록 설정

        if (todoStatusOption === "all_uncompleted") {
            todoStatus = [TodoStatus.IDEA, TodoStatus.READY, TodoStatus.PROGRESS, TodoStatus.TESTING]; // IDEA와 COMPLETED를 제외한 나머지 상태를 가져옴
        }
        if (todoStatusOption === "all_completed") {
            todoStatus = [TodoStatus.COMPLETED]; // IDEA와 COMPLETED를 제외한 나머지 상태를 가져옴
        }
        else if (todoStatusOption === 'uncompleted') {
            todoStatus = [TodoStatus.READY, TodoStatus.PROGRESS, TodoStatus.TESTING]; // IDEA와 COMPLETED를 제외한 나머지 상태를 가져옴
        } else if (todoStatusOption === 'completed') {
            todoStatus = [TodoStatus.COMPLETED]
        } else if (todoStatusOption === 'idea') {
            todoStatus = [TodoStatus.IDEA]
        }

        // 메인 쿼리 설정
        let mainQuery = this.todosRepository
            .createQueryBuilder('todo')
            .leftJoinAndSelect('todo.manager', 'manager')
            .leftJoinAndSelect('todo.supervisor', 'supervisor')
            .leftJoinAndSelect('todo.briefings', 'briefings')
            .leftJoinAndSelect('todo.supplementaryTodos', 'supplementaryTodos')
            .leftJoinAndSelect('supplementaryTodos.manager', 'supplementaryTodosManager')
            .leftJoinAndSelect('supplementaryTodos.briefings', 'supplementaryTodosBriefings')
            .leftJoinAndSelect('supplementaryTodosBriefings.writer', 'supplementaryTodosBriefingsWriter')
            .leftJoinAndSelect('briefings.writer', 'writer')

        if (todoStatusOption === "all_completed") {
            // console.log("이게 실행 됐나?");
            mainQuery = mainQuery.andWhere('todo.status IN (:...status)', { status: todoStatus })
            mainQuery = mainQuery.addOrderBy('todo.completedAt', 'ASC')
            mainQuery = mainQuery.addOrderBy('todo.id', 'DESC');
        }
        else if (todoStatusOption === "all_uncompleted") {
            mainQuery = mainQuery.andWhere('todo.status IN (:...status)', { status: todoStatus })
            mainQuery = mainQuery.orderBy('manager.email')
            mainQuery = mainQuery.addOrderBy(
                `CASE 
                WHEN todo.status = 'idea' THEN 1 
                WHEN todo.status = 'ready' THEN 2
                WHEN todo.status = 'progress' THEN 3
                WHEN todo.status = 'testing' THEN 4
                ELSE 4
                END`,
                'ASC'
            );
            mainQuery = mainQuery.addOrderBy('todo.id', 'DESC');
            mainQuery = mainQuery.addOrderBy(
                `CASE 
                    WHEN supplementaryTodos.status = 'idea' THEN 1
                    WHEN supplementaryTodos.status = 'ready' THEN 2
                    WHEN supplementaryTodos.status = 'progress' THEN 3
                    WHEN supplementaryTodos.status = 'testing' THEN 4
                    WHEN supplementaryTodos.status = 'complete' THEN 5
                    ELSE 6
                    END`,
                'ASC'
            );
            mainQuery = mainQuery.addOrderBy('supplementaryTodos.id', 'DESC');

        }
        else {
            console.log("여기가 맞지 ??? : ", todoStatus);
            mainQuery = mainQuery.andWhere('todo.status IN (:...status)', { status: todoStatus })
            mainQuery = mainQuery.andWhere('manager.id = :userId', { userId })
            mainQuery = mainQuery.addOrderBy('todo.id', 'DESC');
            mainQuery = mainQuery.addOrderBy('supplementaryTodos.id', 'ASC');

        }

        const todoList = await mainQuery.getMany();

        const totalCount = todoList.length;

        return {
            usersEmailInfo,
            todoList,
            totalCount,
            perPage
        };
    }



    async loadMoreTodosForScroll(
        lastId: number = 1,
        perPage: number = 20
    ): Promise<
        {
            todoList: TodosModel[],
            totalCount: number,
            isEnd: boolean
        }
    > {

        // lastId 이후의 20개 todos 가져오기
        const [todoList, totalCount] = await this.todosRepository.findAndCount({
            where: {
                id: LessThan(lastId)
            },
            take: perPage,
            relations: ['manager', 'briefings', 'briefings.writer'], // 'briefings' 관계 추가
            order: {
                id: 'DESC'
            }
        });

        // 만약 todoList 개수 가 perPage 이하인 경우 isEnd = True
        const isEnd = todoList.length < perPage;

        return {
            todoList,
            totalCount,
            isEnd
            // isEnd
        }
    }

    // async deleteTodosForCheckedIds(checkedIds: number[], loginUser): Promise<any> {
    //     try {
    //         // 삭제할 Todo들을 조회합니다.
    //         // const todosToDelete = await this.todosRepository.findByIds(checkedIds);
    //         const todosToDelete = await this.todosRepository.find({
    //             where: { id: In(checkedIds) }, // In 연산자를 사용하여 checkedIds에 해당하는 Todo를 검색합니다.
    //             relations: ['manager'], // manager와의 관계를 로드합니다.
    //         });
    //         console.log("loginUser delete : ", loginUser);

    //         // 할일:
    //         // this.todosRepository 에서 checkedIds 에 해당하는 데이터를 삭제 하되
    //         // 각 todo.manager.email !=== loginUser.email 인 경우 즉 loginUser.email 인 사람이 작성한게 있을 경우 삭제 안된다고 응답 하게 하고 싶어

    //         const deleteResult = await this.todosRepository.delete(checkedIds);

    //         if (deleteResult.affected === 0) {
    //             throw new NotFoundException('삭제할 Todo를 찾을 수 없습니다.');
    //         }

    //         return { message: `Todo 삭제 완료: ${deleteResult.affected}개의 Todo가 삭제되었습니다.` };
    //     } catch (error) {

    //         throw new ForbiddenException(`${error.message}`);
    //     }
    // }

    async deleteTodosForCheckedIds(checkedIds: number[], loginUser): Promise<any> {
        try {
            // 삭제할 Todo들을 조회합니다.
            const todosToDelete = await this.todosRepository.find({
                where: { id: In(checkedIds) }, // In 연산자를 사용하여 checkedIds에 해당하는 Todo를 검색합니다.
                relations: ['manager'], // manager와의 관계를 로드합니다.
            });
            console.log("loginUser delete : ", loginUser);

            // 삭제할 Todo를 필터링하여 조건에 맞지 않는 경우 제외합니다.
            const filteredTodosToDelete = todosToDelete.filter(todo => todo.manager.email !== loginUser.email);

            if (filteredTodosToDelete.length > 0) {
                return {
                    success: false,
                    message: `삭제할 권한이 없습니다.`
                };
            }

            // 삭제할 Todo들의 id를 추출합니다.
            const idsToDelete = filteredTodosToDelete.map(todo => todo.id);

            // Todo를 삭제합니다.
            const deleteResult = await this.todosRepository.delete(idsToDelete);

            if (deleteResult.affected === 0) {
                throw new NotFoundException('삭제할 Todo를 찾을 수 없습니다.');
            }

            return { message: `Todo 삭제 완료: ${deleteResult.affected}개의 Todo가 삭제되었습니다.` };
        } catch (error) {
            throw new ForbiddenException(`${error.message}`);
        }
    }


    async deleteSupplementaryTodosForCheckedIds(checkedIds: number[], loginUser): Promise<any> {
        try {
            // 삭제할 Todo들을 조회합니다.
            const todosToDelete = await this.supplementaryTodosRepo.find({
                where: { id: In(checkedIds) },
                relations: ['manager'],
            });

            const filteredTodosToDelete = todosToDelete.filter(todo => todo.manager.email !== loginUser.email);
            if (filteredTodosToDelete.length > 0) {
                return {
                    success: false,
                    message: `삭제할 권한이 없습니다.`
                };
            }

            // 삭제 권한이 있는 경우에만 Todo를 삭제합니다.
            const deleteResult = await this.supplementaryTodosRepo.delete(checkedIds);

            if (deleteResult.affected === 0) {
                throw new NotFoundException('삭제할 Todo를 찾을 수 없습니다.');
            }

            return { message: `Todo 삭제 완료: ${deleteResult.affected}개의 note가 삭제되었습니다.` };
        } catch (error) {

            throw new ForbiddenException(`${error.message}`);
        }
    }

    async simpleCreateTodo(todoDto: SimpleCreateTodoDto): Promise<TodosModel[]> {
        const { task, deadline, email, rowNum, todoStatusOption } = todoDto;

        console.log("todoStatusOption ?? ", todoStatusOption);

        let statusOption;
        if (todoStatusOption === "idea") {
            statusOption = TodoStatus.IDEA
        } else if (todoStatusOption === "uncompleted") {
            statusOption = TodoStatus.READY
        } else if (todoStatusOption === "completed") {
            statusOption = TodoStatus.COMPLETED
        }

        console.log("statusOption : ", statusOption);


        const managerObj = await this.usersRepository.findOne({
            where: {
                email: email
            }
        });

        if (!managerObj) {
            throw new NotFoundException('유저 정보를 찾을수 없습니다.');
        }
        const todoPromises = [];
        for (let i = 0; i < rowNum; i++) {
            const todo = this.todosRepository.create({
                task,
                deadline,
                manager: managerObj,
                status: statusOption
            });
            todoPromises.push(this.todosRepository.save(todo));
        }
        return Promise.all(todoPromises);
    }



    async simpleCreateSupplementaryTodo(todoDto: SimpleCreateSupplementTodoDto): Promise<{ createdTodos: TodosModel[], count: number }> {

        const { parentTodoId, task, deadline, email, rowNum } = todoDto;
        console.log("simple create supplementary todo : ", parentTodoId);

        // const todoObj = 
        const todoObj = await this.todosRepository.findOne({
            where: {
                id: parentTodoId
            }
        });
        if (!todoObj) {
            throw new NotFoundException('부모 todo를 찾을 수 없습니다.');
        }
        const managerObj = await this.usersRepository.findOne({
            where: {
                email: email
            }
        });

        if (!managerObj) {
            throw new NotFoundException('유저 정보를 찾을수 없습니다.');
        }

        const todoPromises = [];
        for (let i = 0; i < rowNum; i++) {
            const todo = this.supplementaryTodosRepo.create({
                todo: todoObj,
                task,
                startTime: new Date(),
                deadline,
                manager: managerObj,
                status: TodoStatus.READY
            });
            todoPromises.push(this.supplementaryTodosRepo.save(todo));
        }
        const createdTodos = await Promise.all(todoPromises);
        const count = createdTodos.length;
        return { createdTodos, count };
    }


}
