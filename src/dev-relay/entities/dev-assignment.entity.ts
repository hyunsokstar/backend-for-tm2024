// src\dev-relay\entities\dev-assignment.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
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

export enum AssignmentCategory {
    BASIC = 'basic',
    CHALLENGE = 'challenge',
    UI_UX = 'ui/ux',
    RESEARCH = 'research',
}

@Entity()
export class DevAssignment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: WeekDay, default: WeekDay.MONDAY })
    day: WeekDay;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'enum', enum: AssignmentCategory, default: AssignmentCategory.BASIC })
    category: AssignmentCategory;

    @OneToMany(() => DevAssignmentSubmission, submission => submission.devAssignment)
    submissions: DevAssignmentSubmission[];

}
