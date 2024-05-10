import { DevSpec } from "../entities/dev-spec.entity";

export interface GroupedDevSpecs {
    language: DevSpec[];
    backend: DevSpec[];
    frontend: DevSpec[];
    orm: DevSpec[];
    css: DevSpec[];
}
