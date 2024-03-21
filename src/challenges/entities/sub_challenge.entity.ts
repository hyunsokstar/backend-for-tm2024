import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { ChallengesModel } from './challenge.entity';


@Entity('sub_challenges')
export class SubChallengesModel {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    subChallengeName: string;

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
}
