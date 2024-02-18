interface ITypeForRoadMapRow {
    id: number;
    title: string;
    description: string;
    category: string;
    createdAt: Date;
    updatedAt: Date | null;
}

export interface ReponseTypeForGetAllRoadMapList {
    perPage: number;
    totalCount: number;
    roadMapList: ITypeForRoadMapRow[];
}