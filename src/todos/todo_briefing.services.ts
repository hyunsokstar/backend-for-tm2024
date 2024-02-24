import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TodosModel } from './entities/todos.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { TodoBriefingModel } from './entities/todo_briefing.entity';
import { AddTodoBriefingDto } from './dtos/todo-briefing.dto';
import { SupplementaryTodosModel } from './entities/supplementary_todos.entity';
import { SupplementaryTodoBriefingModel } from './entities/supplementary_todo_briefing.entity';

@Injectable()
export class TodoBriefingService {
    constructor(
        @InjectRepository(TodosModel)
        private readonly todosRepository: Repository<TodosModel>,
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
        @InjectRepository(TodoBriefingModel)
        private readonly todoBriefingRepo: Repository<TodoBriefingModel>,
        @InjectRepository(SupplementaryTodosModel)
        private readonly supplementaryTodosRepo: Repository<SupplementaryTodosModel>,
        @InjectRepository(SupplementaryTodoBriefingModel)
        private readonly supplementaryTodoBriefingRepo: Repository<SupplementaryTodoBriefingModel>,
    ) { }

    async addTodoBriefing(todoId, briefingDto: AddTodoBriefingDto): Promise<TodoBriefingModel | SupplementaryTodoBriefingModel> {
        const { content, position, isMainOrSub } = briefingDto;
        console.log("isMainOrSub :", isMainOrSub);

        if (isMainOrSub === "main") {
            const todoObj = await this.todosRepository.findOne({ where: { id: todoId } });
            const userObj = await this.usersRepository.findOne({ where: { id: briefingDto.userId } })

            if (!todoObj) {
                throw new NotFoundException(`Todo with ID ${todoId} not found`);
            }

            const newBriefing = new TodoBriefingModel();
            newBriefing.content = briefingDto.content;
            newBriefing.position = briefingDto.position;
            newBriefing.refImage = briefingDto.refImage;
            newBriefing.todo = todoObj;
            newBriefing.writer = userObj;

            return await this.todoBriefingRepo.save(newBriefing);
        } else if (isMainOrSub === "sub") {
            const todoObj = await this.supplementaryTodosRepo.findOne({ where: { id: todoId } });
            const userObj = await this.usersRepository.findOne({ where: { id: briefingDto.userId } })

            console.log("todoObj at create chatboard row: ", todoObj);


            if (!todoObj) {
                throw new NotFoundException(`Todo with ID ${todoId} not found`);
            }

            const newBriefing = new SupplementaryTodoBriefingModel();
            newBriefing.content = briefingDto.content;
            newBriefing.position = briefingDto.position;
            newBriefing.refImage = briefingDto.refImage;
            newBriefing.todo = todoObj;
            newBriefing.writer = userObj;

            console.log("sub !");

            return await this.supplementaryTodoBriefingRepo.save(newBriefing);
        }
    }


    async getAllTodoBriefingsByTodoId(todoId: number): Promise<TodoBriefingModel[]> {
        const todoBriefings = await this.todoBriefingRepo
            .createQueryBuilder('todoBriefing')
            .leftJoinAndSelect('todoBriefing.writer', 'writer')
            .select(['todoBriefing.id', 'todoBriefing.content', 'todoBriefing.position', 'writer.id', 'writer.email', 'writer.nickname', 'writer.profileImage'])
            .where('todoBriefing.todo = :todoId', { todoId })
            .getMany();

        if (!todoBriefings || todoBriefings.length === 0) {
            throw new NotFoundException(`No todo briefings found for Todo with ID ${todoId}`);
        }

        return todoBriefings;
    }

}
