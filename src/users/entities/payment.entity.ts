import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UsersModel } from './users.entity';

@Entity()
export class PaymentsModelForCashPoints {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersModel, user => user.paymentsForCashPoints, { onDelete: 'CASCADE', nullable: true })
    user: UsersModel;

    @Column({ type: 'int' })
    paymentAmount: number;

    @Column()
    merchantUid: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
