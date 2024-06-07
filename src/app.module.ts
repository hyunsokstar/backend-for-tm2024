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
import { StarterKitsModel } from "./starter-projects/entities/starter-project.entity";
import { ParticipantsForRoadMapModel } from "./technotes/entities/participantsForRoadMap.entity";
import { ParticipantsForSkilNoteModel } from "./technotes/entities/participantsForSkilNote.entity";
import { ParticipantsForTechNoteModel } from "./technotes/entities/participantsForTechNote.entity";
import { PaymentsModelForCashPoints } from "./users/entities/payment.entity";
import { ChallengesModule } from './challenges/challenges.module';
import { ChallengesModel } from "./challenges/entities/challenge.entity";
import { SubChallengesModel } from "./challenges/entities/sub_challenge.entity";
import { ParticipantsForSubChallengeModel } from "./challenges/entities/participants-for-sub-challenge.entity";
import { SubChallengeBriefingsModel } from "./challenges/entities/sub-challenge-briefings.entity";
import { DevSpecModule } from './dev-spec/dev-spec.module';
import { DevSpec } from "./dev-spec/entities/dev-spec.entity";
import { DislikeDevSpec } from "./dev-spec/entities/dislike-dev-spec";
import { LikeDevSpec } from "./dev-spec/entities/like-dev-spec";
import { FavoriteDevSpec } from "./dev-spec/entities/favorite-dev-spec.entity";
import { LibraryForFavoriteDevSpec } from "./dev-spec/entities/library-for-favorite-dev-spec";
import { ToolForFavoriteDevSpec } from "./dev-spec/entities/tool-for-favorite-dev-spec.entity";
import { DevRelayModule } from './dev-relay/dev-relay.module';
import { DevRelay } from "./dev-relay/entities/dev-relay.entity";
import { DevAssignment } from "./dev-relay/entities/dev-assignment.entity";
import { DevAssignmentSubmission } from "./dev-relay/entities/dev-assignment-submission.entity";
import { CategoryForDevAssignment } from "./dev-relay/entities/category-for-dev-assignment.entity";
import { SubjectForCategory } from "./dev-relay/entities/subject-for-category.entity";
import { DevBattleModule } from './dev-battle/dev-battle.module';
import { DevBattle } from "./dev-battle/entities/dev-battle.entity";
import { TagForDevBattle } from "./dev-battle/entities/tag.entity";
import { TeamForDevBattle } from "./dev-battle/entities/team-for-dev-battle.entity";
import { DevProgressForTeam } from "./dev-battle/entities/dev-progress-for-team.entity";
import { MemberForDevTeam } from "./dev-battle/entities/member-for-dev-team.entity";
import { DevSpecForTeamBattle } from "./dev-battle/entities/dev-spec-for-team-battle.entity";
import { TodoForDevBattleSubject } from "./dev-battle/entities/todo-for-dev-battle-subject.entity";

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
        StarterKitsModel,
        ParticipantsForRoadMapModel,
        ParticipantsForSkilNoteModel,
        ParticipantsForTechNoteModel,
        PaymentsModelForCashPoints,
        ChallengesModel,
        SubChallengesModel,
        ParticipantsForSubChallengeModel,
        SubChallengeBriefingsModel,
        DevSpec,
        LikeDevSpec,
        DislikeDevSpec,
        FavoriteDevSpec,
        LibraryForFavoriteDevSpec,
        ToolForFavoriteDevSpec,
        DevRelay,
        DevAssignment,
        DevAssignmentSubmission,
        CategoryForDevAssignment,
        SubjectForCategory,
        DevBattle,
        TagForDevBattle,
        TeamForDevBattle,
        DevProgressForTeam,
        MemberForDevTeam,
        DevSpecForTeamBattle,
        TodoForDevBattleSubject
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
    ChallengesModule,
    SubChallengesModel,
    DevSpecModule,
    DevRelayModule,
    DevBattleModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: TypeORMExceptionFilter,
    },
  ],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // 모든 경로에 대해 미들웨어 적용
  }
}
