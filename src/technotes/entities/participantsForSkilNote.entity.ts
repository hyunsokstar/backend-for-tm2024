import { UsersModel } from 'src/users/entities/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { SkilNotesModel } from './skilnotes.entity';
import { TechNotesModel } from './technotes.entity';

@Entity()
export class ParticipantsForSkilNoteModel {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersModel, user => user.takenCoursesForSkilNote, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: UsersModel;

    @ManyToOne(() => SkilNotesModel, skilnote => skilnote.participants, { onDelete: 'CASCADE', nullable: false })
    skilNote: SkilNotesModel;

    @ManyToOne(() => TechNotesModel, { onDelete: 'CASCADE', nullable: true })
    techNote: TechNotesModel

    @Column({ default: false })
    isCompleted: boolean;

    @Column({ default: false })
    authorityForEdit: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
