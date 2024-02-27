import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { SkilNotesModel } from './skilnotes.entity';
import { LikesModelForTechNote } from './likesForTechNote.entity';
import { bookMarksForTechNoteModel } from './bookMarks.entity';
import { RoadMapModel } from './roadMap.entity';
import { ParticipantsForTechNoteModel } from './participantsForTechNote.entity';

// export enum TodoStatus {
//     READY = 'ready',
//     PROGRESS = 'progress',
//     TESTING = 'testing',
//     COMPLETED = 'complete',
// }

@Entity()
export class TechNotesModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    category: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: true })
    writer: UsersModel;

    @ManyToOne(() => RoadMapModel, { onDelete: 'CASCADE', nullable: true })
    roadMap: RoadMapModel;

    @OneToMany(() => SkilNotesModel, skilnote => skilnote.techNote)
    skilnotes: SkilNotesModel[]

    @OneToMany(() => ParticipantsForTechNoteModel, participant => participant.techNote)
    participants: ParticipantsForTechNoteModel[]

    @OneToMany(() => ParticipantsForTechNoteModel, participants => participants.techNote)
    participants: ParticipantsForTechNoteModel[]

    @OneToMany(() => LikesModelForTechNote, likes => likes.techNote)
    likes: LikesModelForTechNote[]

    @OneToMany(() => bookMarksForTechNoteModel, bookmarks => bookmarks.techNote)
    bookMarks: bookMarksForTechNoteModel[]

    countForLikes: number;
    countForBookMarks: number;
    countForSkilNotes: number;

}