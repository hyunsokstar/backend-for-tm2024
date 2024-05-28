import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { DevBattle } from './dev-battle.entity';

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
}
