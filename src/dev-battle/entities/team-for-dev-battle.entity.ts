import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { DevBattle } from './dev-battle.entity';
import { DevProgressForTeam } from './dev-progress-for-team.entity';

@Entity()
export class TeamForDevBattle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => DevBattle, (devBattle) => devBattle.teams)
    devBattle: DevBattle;

    @OneToMany(() => DevProgressForTeam, (devProgressForTeam) => devProgressForTeam.team)
    devProgressForTeams: DevProgressForTeam[];

}
