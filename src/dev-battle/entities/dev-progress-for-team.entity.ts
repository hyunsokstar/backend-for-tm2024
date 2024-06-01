// dev-progress-for-team.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { DevBattle } from './dev-battle.entity';
import { TeamForDevBattle } from './team-for-dev-battle.entity';

export enum DevStatus {
    READY = 'ready',
    IN_PROGRESS = 'in_progress',
    TEST = 'test',
    COMPLETE = 'complete',
}

// @PrimaryGeneratedColumn()
// id: number;

@Entity('dev_progress_for_team')
export class DevProgressForTeam {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    task: string;

    @Column('text', { nullable: true })
    figmaUrl: string;

    @Column('text', { nullable: true })
    youtubeUrl: string;

    @Column({ type: 'int', nullable: true })
    skilNoteId: number;

    @Column('text', { nullable: true })
    noteUrl: string;

    @Column({
        type: 'enum',
        enum: DevStatus,
        default: DevStatus.READY,
    })
    status: DevStatus;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => TeamForDevBattle, (team) => team.devProgressForTeams, { onDelete: 'CASCADE' })
    team: TeamForDevBattle;

}
