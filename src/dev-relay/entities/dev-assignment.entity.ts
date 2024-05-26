import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { CategoryForDevAssignment } from './category-for-dev-assignment.entity';
import { DevAssignmentSubmission } from './dev-assignment-submission.entity';

export enum WeekDay {
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday',
    SUNDAY = 'sunday',
}

@Entity()
export class DevAssignment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', default: WeekDay.MONDAY })
    day: WeekDay;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @ManyToOne(() => CategoryForDevAssignment, category => category.devAssignments, { cascade: true })
    category: CategoryForDevAssignment;

    @OneToMany(() => DevAssignmentSubmission, submission => submission.devAssignment)
    submissions: DevAssignmentSubmission[];
}
