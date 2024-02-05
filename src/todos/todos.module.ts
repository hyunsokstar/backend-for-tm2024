import { Module } from '@nestjs/common';
import { TodosController } from './controller/todos.controller';
import { TodosService } from './todos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModel } from './entities/todos.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { TodoBriefingModel } from './entities/todo_briefing.entity';
import { TodoBriefingController } from './controller/todo_briefing.controller';
import { TodoBriefingService } from './todo_briefing.services';
import { SkilNotesModel } from 'src/technotes/entities/skilnotes.entity';
import { SupplementaryTodosModel } from './entities/supplementary_todos.entity';
import { SkilNoteContentsModel } from 'src/technotes/entities/skilnote_contents.entity';
import { SupplementaryTodoBriefingModel } from './entities/supplementary_todo_briefing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TodosModel,
      UsersModel,
      TodoBriefingModel,
      SupplementaryTodosModel,
      SupplementaryTodoBriefingModel,
      SkilNotesModel,
      SkilNoteContentsModel
    ])
  ],
  controllers: [TodosController, TodoBriefingController],
  providers: [TodosService, TodoBriefingService]
})

export class TodosModule { }
