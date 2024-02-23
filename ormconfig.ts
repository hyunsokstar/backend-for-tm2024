import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'userAdminBoard',
    entities: [
        "src/**/*.entity{.ts,.js}"
    ],
    migrations: [
        "src/migrations/*.ts"
    ],
    migrationsTableName: 'migrations',
});