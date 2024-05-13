import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { FavoriteDevSpec } from './favorite-dev-spec.entity';

@Entity()
export class LibraryForFavoriteDevSpec {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    library: string;

    @Column()
    siteUrl: string;

    // One-to-Many relationship with FavoriteDevSpec entity
    @ManyToOne(() => FavoriteDevSpec, (favoriteDevSpec) => favoriteDevSpec.libraries)
    favoriteDevSpec: FavoriteDevSpec;
}