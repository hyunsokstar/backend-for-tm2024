import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { DevBattle } from './dev-battle.entity';

@Entity('todoForDevBattleSubject')
export class TodoForDevBattleSubject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn({ nullable: true })
    dueDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => DevBattle, (devBattle) => devBattle.todos)
    devBattle: DevBattle;
}
