// src\technotes\entities\roadMap.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { TechNotesModel } from './technotes.entity';
import { ParticipantsForRoadMapModel } from './participantsForRoadMap.entity';

@Entity()
export class RoadMapModel {
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

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: true })
    writer: UsersModel;

    @OneToMany(() => TechNotesModel, techNote => techNote.roadMap)
    techNotes: TechNotesModel[]

    @OneToMany(() => ParticipantsForRoadMapModel, techNote => techNote.roadMap)
    participants: ParticipantsForRoadMapModel[]

}