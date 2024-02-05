import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { TechNotesModel } from './technotes.entity';

@Entity()
export class bookMarksForTechNoteModel {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: false })
    user: UsersModel;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => TechNotesModel, techNote => techNote.bookMarks, { onDelete: 'CASCADE', nullable: false })
    techNote: TechNotesModel;

}
