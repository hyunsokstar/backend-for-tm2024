import { UsersModel } from 'src/users/entities/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RoadMapModel } from './roadMap.entity';

@Entity()
export class ParticipantsForRoadMapModel {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: UsersModel;

    @Column({ nullable: false })
    currentNote: string;

    @Column({ nullable: false })
    authorityForEdit: boolean;

    @ManyToOne(() => RoadMapModel, roadMap => roadMap.participants, { onDelete: 'CASCADE', nullable: false })
    roadMap: RoadMapModel;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

}
