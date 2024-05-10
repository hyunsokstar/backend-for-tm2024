import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { DevSpec } from './dev-spec.entity';

@Entity()
export class DislikeDevSpec {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersModel)
    user: UsersModel;

    @ManyToOne(() => DevSpec, devSpec => devSpec.disLikeDevSpecs)
    devSpec: DevSpec;
}