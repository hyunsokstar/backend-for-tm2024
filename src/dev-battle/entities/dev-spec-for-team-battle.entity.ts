// File name: dev-spec-for-team-battle.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { TeamForDevBattle } from './team-for-dev-battle.entity';

@Entity('dev_spec_for_team_battle')
export class DevSpecForTeamBattle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    backendLanguage: string;

    @Column({ type: 'varchar', length: 255 })
    frontendLanguage: string;

    @Column({ type: 'simple-array', nullable: true })
    backendLibrary: string[];

    @Column({ type: 'simple-array', nullable: true })
    frontendLibrary: string[];

    @Column({ type: 'varchar', length: 255, nullable: true })
    orm: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    css: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    app: string;

    @Column({ type: 'simple-array', nullable: true })
    collaborationTool: string[];

    @Column({ type: 'simple-array', nullable: true })
    devops: string[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(() => TeamForDevBattle, (team) => team.devSpecs)
    devTeam: TeamForDevBattle;
}
