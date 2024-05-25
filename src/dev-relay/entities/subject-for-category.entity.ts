import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CategoryForDevAssignment } from './category-for-dev-assignment.entity';

@Entity()
export class SubjectForCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @OneToMany(() => CategoryForDevAssignment, category => category.subject) // 반대 방향의 참조 설정
    categories: CategoryForDevAssignment[];
}
