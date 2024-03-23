import { UsersModel } from 'src/users/entities/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { SubChallengesModel } from './sub_challenge.entity';

@Entity()
export class ParticipantsForSubChallengeModel {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersModel, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: UsersModel;

    @ManyToOne(() => SubChallengesModel, subChallenge => subChallenge.participants, { onDelete: 'CASCADE', nullable: false })
    subChallenge: SubChallengesModel;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column()
    noteUrl: string;
}