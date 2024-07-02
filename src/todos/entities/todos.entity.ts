import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { TodoBriefingModel } from './todo_briefing.entity';
import { SkilNotesModel } from 'src/technotes/entities/skilnotes.entity';
import { SupplementaryTodosModel } from './supplementary_todos.entity';

export enum TodoStatus {
    ENTRY = 'entry',
    IDEA = 'idea',
    READY = 'ready',
    PROGRESS = 'progress',
    TESTING = 'testing',
    COMPLETED = 'complete',
}

@Entity()
export class TodosModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    task: string;

    @Column({ nullable: true, default: false })
    isForToday: string

    @Column({ nullable: true, default: false })
    isUrgent: boolean;

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

    @ManyToOne(() => UsersModel, user => user.todosForManager)
    manager: UsersModel;

    @ManyToOne(() => UsersModel, user => user.todosForSuperVisor)
    supervisor: UsersModel;

    @OneToMany(() => TodoBriefingModel, briefing => briefing.todo)
    briefings: TodoBriefingModel

    @Column({ nullable: true })
    skilNoteUrl: string;

    @Column({ nullable: true })
    refSkilNoteId: number

    @OneToMany(() => SupplementaryTodosModel, supplementaryTodo => supplementaryTodo.todo)
    supplementaryTodos: any;

    @Column({ default: 1 })
    order: number;
}