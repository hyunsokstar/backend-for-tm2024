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

    @ManyToOne(() => RoadMapModel, roadMap => roadMap.participants, { onDelete: 'CASCADE', nullable: false })
    roadMap: RoadMapModel;

    @Column({ nullable: true })
    currentNote: string;

    @Column({ default: false })
    authorityForEdit: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

}
