import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { SupplementaryTodosModel } from './supplementary_todos.entity';

export enum Position {
    Manager = "manager",
    Commenter = "commenter"
}

@Entity()
export class SupplementaryTodoBriefingModel {
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

    @ManyToOne(() => SupplementaryTodosModel, supplement_todo => supplement_todo.briefings, { onDelete: 'CASCADE', nullable: true })
    todo: SupplementaryTodosModel;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: true })
    writer: UsersModel
    user: UsersModel

    @Column({ type: 'varchar', nullable: true })
    refImage: string;
}
