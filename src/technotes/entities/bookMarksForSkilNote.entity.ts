import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { TechNotesModel } from './technotes.entity';
import { SkilNotesModel } from './skilnotes.entity';

@Entity()
export class BookMarksForSkilNoteModel {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: true })
    user: UsersModel;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => SkilNotesModel, skilnote => skilnote.bookMarks, { onDelete: 'CASCADE', nullable: true })
    skilNote: SkilNotesModel;
}
