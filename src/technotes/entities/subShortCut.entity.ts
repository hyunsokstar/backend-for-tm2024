import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { ShortCutsModel } from './shortCut.entity';

@Entity()
export class SubShortCutsModel {
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

    @ManyToOne(() => ShortCutsModel, { onDelete: 'CASCADE', nullable: true })
    parentShortcut: ShortCutsModel;

}
