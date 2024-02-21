import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { SubShortCutsModel } from './subShortCut.entity';

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

    @OneToMany(() => SubShortCutsModel, subShortcut => subShortcut.parentShortcut)
    subShortCuts: SubShortCutsModel[]
}
