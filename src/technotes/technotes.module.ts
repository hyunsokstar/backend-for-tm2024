import { Module } from '@nestjs/common';
import { TechnotesController } from './technotes.controller';
import { TechnotesService } from './technotes.service';
import { TechNotesModel } from './entities/technotes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { SkilNotesModel } from './entities/skilnotes.entity';
import { SkilnotesController } from './skilnotes/skilnotes.controller';
import { SkilnotesService } from './skilnotes/skilnotes.service';
import { SkilNoteContentsModel } from './entities/skilnote_contents.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { LikesModelForTechNote } from './entities/likesForTechNote.entity';
import { bookMarksForTechNoteModel } from './entities/bookMarks.entity';
import { LikesModelForSkilNote } from './entities/likesForSkilNote.entity';
import { BookMarksForSkilNoteModel } from './entities/bookMarksForSkilNote.entity';
import { BookMarksForSkilNoteContentsModel } from './entities/bookMarksForSkilNoteContent.entity';
import { RoadMapModel } from './entities/roadMap.entity';
import { RoadmapController } from './roadmap/roadmap.controller';
import { RoadmapService } from './roadmap/roadmap.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoadMapModel,
      TechNotesModel,
      UsersModel,
      SkilNotesModel,
      SkilNoteContentsModel,
      LikesModelForTechNote,
      bookMarksForTechNoteModel,
      LikesModelForSkilNote,
      BookMarksForSkilNoteModel,
      BookMarksForSkilNoteContentsModel
    ])
  ],
  controllers: [TechnotesController, SkilnotesController, RoadmapController],
  providers: [TechnotesService, SkilnotesService, AuthGuard, RoadmapService]
})


export class TechnotesModule { }
