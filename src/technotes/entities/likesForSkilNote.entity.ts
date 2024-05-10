import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { TechNotesModel } from './technotes.entity';
import { SkilNotesModel } from './skilnotes.entity';

@Entity()
export class LikesModelForSkilNote {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: false })
    user: UsersModel;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // @OneToMany(() => LikesModelForSkilNote, likes => likes.skilNote)
    // likes: LikesModelForSkilNote[]

    @ManyToOne(() => SkilNotesModel, skilnote => skilnote.likes, { onDelete: 'CASCADE', nullable: false })
    skilNote: SkilNotesModel;
}
