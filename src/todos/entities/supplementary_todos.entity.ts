import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { TodoBriefingModel } from './todo_briefing.entity';
import { SkilNotesModel } from 'src/technotes/entities/skilnotes.entity';
import { TodosModel } from './todos.entity';
import { SupplementaryTodoBriefingModel } from './supplementary_todo_briefing.entity';

export enum TodoStatus {
    ENTRY = 'entry',
    IDEA = 'idea',
    READY = 'ready',
    PROGRESS = 'progress',
    TESTING = 'testing',
    COMPLETED = 'complete',
}

@Entity()
export class SupplementaryTodosModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    task: string;

    @Column({ nullable: true })
    details: string;

    @Column({ type: 'enum', enum: TodoStatus, default: TodoStatus.READY, nullable: true })
    status: TodoStatus;

    @Column({ type: 'timestamp', nullable: true })
    startTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    completedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deadline: Date;

    @Column({ nullable: true })
    elapsedTime: string;

    @Column({ type: 'int', default: 1, nullable: true })
    priority: number;

    @ManyToOne(() => UsersModel, user => user.supplementaryTodosForManager)
    manager: UsersModel;

    @ManyToOne(() => UsersModel, user => user.todosForSuperVisor)
    supervisor: UsersModel;

    @OneToMany(() => SupplementaryTodoBriefingModel, supplementary_todo_brifing => supplementary_todo_brifing.todo)
    briefings: SupplementaryTodoBriefingModel

    @Column({ nullable: true })
    skilNoteUrl: string;

    @Column({ nullable: true })
    refSkilNoteId: number

    @ManyToOne(() => TodosModel, todo => todo.supplementaryTodos, { onDelete: 'CASCADE', nullable: true })
    todo: TodosModel;

}