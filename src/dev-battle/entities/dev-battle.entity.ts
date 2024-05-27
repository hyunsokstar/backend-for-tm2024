import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { TagForDevBattle } from './tag.entity';

@Entity()
export class DevBattle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    subject: string;

    @ManyToMany(() => TagForDevBattle, (tag) => tag.devBattles)
    @JoinTable({ name: 'dev_battle_tags' }) // Explicit join table for clarity
    tags: TagForDevBattle[];
}
