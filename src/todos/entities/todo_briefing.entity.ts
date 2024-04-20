import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { TodosModel } from './todos.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { IsString } from 'class-validator';

export enum Position {
    Manager = "manager",
    Commenter = "commenter"
}

@Entity()
export class TodoBriefingModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ type: 'enum', enum: Position })
    position: Position; // "manager" or "commenter"

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => TodosModel, todo => todo.briefings, { onDelete: 'CASCADE', nullable: true })
    todo: TodosModel;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: true })
    writer: UsersModel

    @Column({ type: 'varchar', nullable: true })
    refImage: string;


}
