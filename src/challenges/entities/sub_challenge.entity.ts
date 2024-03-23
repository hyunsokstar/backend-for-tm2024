import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ChallengesModel } from './challenge.entity';
import { ParticipantsForSubChallengeModel } from './participants-for-sub-challenge.entity';


@Entity('sub_challenges')
export class SubChallengesModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    challengeName: string;

    @Column()
    description: string;

    @Column({ type: 'int' })
    prize: number;

    @ManyToOne(() => ChallengesModel, challenge => challenge.subChallenges, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    challenge: ChallengesModel;

    @Column({ type: 'timestamp', nullable: true })
    deadline: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ParticipantsForSubChallengeModel, participant => participant.subChallenge, {
        nullable: true,
    })
    participants: ParticipantsForSubChallengeModel[];

}
