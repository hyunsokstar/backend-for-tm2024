import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';

@Entity()
export class ShortCutsModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    shortcut: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    category: string;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: true })
    writer: UsersModel;

}
