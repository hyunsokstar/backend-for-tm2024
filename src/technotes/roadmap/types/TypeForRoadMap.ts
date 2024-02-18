import { SaveRoadMapsDto } from "src/technotes/dtos/saveRoadMaps.dto";
import { UsersModel } from "src/users/entities/users.entity";

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

export interface ResponseTypeForSaveRoadMaps {
    success: boolean;
    message: string;
}

export interface IParameterForSaveRoadMaps {
    dtoForSaveRoadMaps: SaveRoadMapsDto[],
    loginUser: UsersModel;
}