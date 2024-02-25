// import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { UsersModel } from "./users/entities/users.entity";
import { APP_FILTER } from "@nestjs/core";
import { TypeORMExceptionFilter } from "./filters/exceptions.filter";
import { ConfigModule } from '@nestjs/config';
import { UserPostingsModel } from "./postings/entities/user_postings.entity";
import { PostingsModule } from './postings/postings.module';
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from "./middlewares/AuthMiddleware";
import { CloudflareModule } from './cloudflare/cloudflare.module';
import { TodosModule } from './todos/todos.module';
import { TodosModel } from "./todos/entities/todos.entity";
import { TechnotesModule } from './technotes/technotes.module';
import { TechNotesModel } from "./technotes/entities/technotes.entity";
import { SkilNotesModel } from "./technotes/entities/skilnotes.entity";
import { SkilNoteContentsModel } from "./technotes/entities/skilnote_contents.entity";
import { GuardsModule } from './guards/guards.module';
import { TodoBriefingModel } from "./todos/entities/todo_briefing.entity";
import { LikesModelForTechNote } from "./technotes/entities/likesForTechNote.entity";
import { bookMarksForTechNoteModel } from "./technotes/entities/bookMarks.entity";
import { LikesModelForSkilNote } from "./technotes/entities/likesForSkilNote.entity";
import { BookMarksForSkilNoteModel } from "./technotes/entities/bookMarksForSkilNote.entity";
import { BookMarksForSkilNoteContentsModel } from "./technotes/entities/bookMarksForSkilNoteContent.entity";
import { SupplementaryTodosModel } from "./todos/entities/supplementary_todos.entity";
import { SupplementaryTodoBriefingModel } from "./todos/entities/supplementary_todo_briefing.entity";
import { RoadMapModel } from "./technotes/entities/roadMap.entity";
import { ShortCutsModel } from "./technotes/entities/shortCut.entity";
import { SubShortCutsModel } from "./technotes/entities/subShortCut.entity";
import { StarterProjectsModule } from './starter-projects/starter-projects.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "127.0.0.1",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "userAdminBoard",
      entities: [
        UsersModel,
        UserPostingsModel,
        TodosModel,
        SupplementaryTodosModel,
        SupplementaryTodoBriefingModel,
        ShortCutsModel,
        SubShortCutsModel,
        RoadMapModel,
        TechNotesModel,
        SkilNotesModel,
        SkilNoteContentsModel,
        TodoBriefingModel,
        LikesModelForTechNote,
        bookMarksForTechNoteModel,
        LikesModelForSkilNote,
        BookMarksForSkilNoteModel,
        BookMarksForSkilNoteContentsModel,
      ],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true, // 어디서든 사용할 수 있도록 설정
      envFilePath: '.env', // 환경 변수 파일 경로 지정
    }),
    UsersModule,
    PostingsModule,
    TodosModule,
    CloudflareModule,
    TechnotesModule,
    GuardsModule,
    StarterProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: TypeORMExceptionFilter,
    },
  ],
})
// export class AppModule { }

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(AuthMiddleware) // 사용할 미들웨어
//       // .forRoutes('/users/login-check-by-accessToken');
//       // .forRoutes(
//       //   '/users/login-check-by-accessToken',
//       //   '/users/login-check-by-refreshToken'
//       // ); // 적용할 경로 설정
//       .forRoutes(
//         // '/users/login-check-by-accessToken',
//         // '/users/login-check-by-refreshToken',
//         '/technotes/saveTechNotes',
//         '/skilnotes/saveRows',
//         '/skilnotes/:skilNoteId/contents/:pageNum',
//         '/skilnotes/content/:skilNoteContentId',
//         '/skilnotes/content/deleteByCheckedIds',
//         'todos/deleteTodosForCheckedRows'
//       ); // 적용할 경로 설정
//   }
// }

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // 모든 경로에 대해 미들웨어 적용
  }
}
