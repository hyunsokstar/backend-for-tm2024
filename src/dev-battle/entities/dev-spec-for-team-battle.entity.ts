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

    @Column({ type: 'varchar', length: 255, nullable: true })
    backendLanguage: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
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

    @ManyToOne(() => TeamForDevBattle, (team) => team.devSpecs, {
        cascade: true, // 여기서 cascade 옵션을 true로 설정합니다.
        onDelete: 'CASCADE', // 또는 onDelete 옵션을 'CASCADE'로 설정할 수도 있습니다.
    })
    devTeam: TeamForDevBattle;;
}
