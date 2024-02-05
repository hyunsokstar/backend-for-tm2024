import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { TodosModel } from 'src/todos/entities/todos.entity';
import { SkilNoteContentsModel } from './skilnote_contents.entity';
import { TechNotesModel } from './technotes.entity';
import { LikesModelForSkilNote } from './likesForSkilNote.entity';
import { BookMarksForSkilNoteModel } from './bookMarksForSkilNote.entity';


@Entity()
export class SkilNotesModel {
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

    @Column({ type: 'int', nullable: true })
    order: number;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: true })
    writer: UsersModel;

    @ManyToOne(() => TechNotesModel, techNote => techNote.skilnotes, { onDelete: 'CASCADE', nullable: true })
    techNote: TechNotesModel;

    @OneToMany(() => SkilNoteContentsModel, content => content.skilNote)
    skilnote_contents: SkilNoteContentsModel[]

    @OneToMany(() => LikesModelForSkilNote, likes => likes.skilNote)
    likes: LikesModelForSkilNote[]

    @OneToMany(() => BookMarksForSkilNoteModel, bookmarks => bookmarks.skilNote)
    bookMarks: BookMarksForSkilNoteModel[]

    countForLikes: any;
    countForBookMarks: number;
    countForSkilNoteContents: number;
    countForSkilNoteContentsPages: number;
}
