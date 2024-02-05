import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { SkilNoteContentsModel } from './skilnote_contents.entity';

@Entity()
export class BookMarksForSkilNoteContentsModel {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        () => UsersModel,
        user => user.myBookMarksForSkilNoteContents,
        { onDelete: 'CASCADE', nullable: false }
    )
    user: UsersModel;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => SkilNoteContentsModel, skilnoteContent => skilnoteContent.bookMarks, { onDelete: 'CASCADE', nullable: false })
    skilNoteContent: SkilNoteContentsModel;

}
