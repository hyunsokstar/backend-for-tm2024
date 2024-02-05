import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { SkilNotesModel } from './skilnotes.entity';
import { BookMarksForSkilNoteContentsModel } from './bookMarksForSkilNoteContent.entity';

export enum TodoStatus {
    READY = 'ready',
    PROGRESS = 'progress',
    TESTING = 'testing',
    COMPLETED = 'complete',
}

@Entity()
export class SkilNoteContentsModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    file: string;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ default: 1 })
    page: number;

    @Column({ default: 1 })
    order: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: true })
    writer: UsersModel;

    @ManyToOne(() => SkilNotesModel, skilnote => skilnote.skilnote_contents, { onDelete: 'CASCADE', nullable: true })
    skilNote: SkilNotesModel;

    @OneToMany(() => BookMarksForSkilNoteContentsModel, bookmarks => bookmarks.skilNoteContent)
    bookMarks: BookMarksForSkilNoteContentsModel[]

}
