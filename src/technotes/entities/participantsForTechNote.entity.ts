

import { UsersModel } from 'src/users/entities/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TechNotesModel } from './technotes.entity';

@Entity()
export class ParticipantsForTechNoteModel {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: UsersModel;

    @ManyToOne(() => TechNotesModel, techNote => techNote.participants, { onDelete: 'CASCADE', nullable: false })
    techNote: TechNotesModel;

    @Column({ default: false })
    isCompleted: boolean;

    @Column({ default: false })
    authorityForEdit: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}


