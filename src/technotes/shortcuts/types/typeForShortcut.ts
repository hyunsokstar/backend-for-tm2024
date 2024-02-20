import { ShortCutsModel } from "src/technotes/entities/shortCut.entity";

export interface ITypeForShortCutRow {
    id: number;
    shortcut: string;
    description: string;
    category: string;
}


export interface ReponseTypeForGetAllShortCutList {
    perPage: number;
    totalCount: number;
    shortCutList: ITypeForShortCutRow[];
}