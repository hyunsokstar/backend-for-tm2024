import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { TagForDevBattle } from './tag.entity';
import { TeamForDevBattle } from './team-for-dev-battle.entity';
import { TodoForDevBattleSubject } from './todo-for-dev-battle-subject.entity';

@Entity()
export class DevBattle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    subject: string;

    @ManyToMany(() => TagForDevBattle, (tag) => tag.devBattles)
    @JoinTable({ name: 'dev_battle_tags' }) // Explicit join table for clarity
    tags: TagForDevBattle[];

    @OneToMany(() => TeamForDevBattle, (team) => team.devBattle)
    teams: TeamForDevBattle[];

    @OneToMany(() => TodoForDevBattleSubject, (todo) => todo.devBattle, { cascade: true })
    todos: TodoForDevBattleSubject[];

}
