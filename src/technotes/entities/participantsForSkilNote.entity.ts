import { UsersModel } from 'src/users/entities/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RoadMapModel } from './roadMap.entity';
import { SkilNotesModel } from './skilnotes.entity';

@Entity()
export class ParticipantsForSkilNoteModel {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: UsersModel;

    @ManyToOne(() => SkilNotesModel, skilnote => skilnote.participants, { onDelete: 'CASCADE', nullable: false })
    skilNote: SkilNotesModel;

    @Column({ default: false })
    isCompleted: boolean;

    @Column({ default: false })
    authorityForEdit: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
