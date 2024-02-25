export interface DtoTypeStarterKitList {
    perPage: number;
    pageNum: number;
}


export interface ITypeForStarterKitRow {
    id: number;
    title: string;
    description: string;
    skilNoteUrl: string;
    createdAt: Date;
    updatedAt: Date | null; // updatedAt이 null이 될 수 있는 경우에 대비하여 string 또는 null로 설정합니다.
}


export interface ResponseTypeForStarterKitList {
    perPage: number;
    totalCount: number;
    starterKitList: ITypeForStarterKitRow[]
}