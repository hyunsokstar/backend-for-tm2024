import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { FavoriteDevSpec } from './favorite-dev-spec.entity';

@Entity()
export class LibraryForFavoriteDevSpec {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    library: string;

    @Column({ nullable: true, default: '' })
    description: string;

    @Column({ nullable: true, default: '' })
    siteUrl: string;

    // One-to-Many relationship with FavoriteDevSpec entity
    @ManyToOne(() => FavoriteDevSpec, (favoriteDevSpec) => favoriteDevSpec.libraries)
    favoriteDevSpec: FavoriteDevSpec;

}