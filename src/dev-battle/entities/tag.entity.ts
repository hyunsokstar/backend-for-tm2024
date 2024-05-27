import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { DevBattle } from './dev-battle.entity';

@Entity()
export class TagForDevBattle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => DevBattle, (devBattle) => devBattle.tags)
    @JoinTable({ name: 'dev_battle_tags' }) // Explicit join table for clarity
    devBattles: DevBattle[];
}
