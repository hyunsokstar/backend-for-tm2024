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
import { ShortCutsModel } from './entities/shortCut.entity';
import { ShortcutsController } from './shortcuts/shortcuts.controller';
import { ShortcutsService } from './shortcuts/shortcuts.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoadMapModel,
      TechNotesModel,
      UsersModel,
      SkilNotesModel,
      SkilNoteContentsModel,
      ShortCutsModel,
      LikesModelForTechNote,
      bookMarksForTechNoteModel,
      LikesModelForSkilNote,
      BookMarksForSkilNoteModel,
      BookMarksForSkilNoteContentsModel
    ])
  ],
  controllers: [TechnotesController, SkilnotesController, RoadmapController, ShortcutsController],
  providers: [TechnotesService, SkilnotesService, AuthGuard, RoadmapService, ShortcutsService]
})


export class TechnotesModule { }
