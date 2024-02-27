<<<<<<< HEAD
import { UsersModel } from 'src/users/entities/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RoadMapModel } from './roadMap.entity';
import { SkilNotesModel } from './skilnotes.entity';
=======


import { UsersModel } from 'src/users/entities/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
>>>>>>> 79e69bf046c65b12e7f22dc37e153da14699aa56
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
<<<<<<< HEAD

}
=======
}


>>>>>>> 79e69bf046c65b12e7f22dc37e153da14699aa56
