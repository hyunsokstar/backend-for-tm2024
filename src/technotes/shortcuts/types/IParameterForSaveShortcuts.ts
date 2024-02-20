import { SaveShortCutsDto } from "src/technotes/dtos/saveShortCut.dto";
import { UsersModel } from "src/users/entities/users.entity";

export interface IParameterForSaveShortCuts {
    dataForSaveShortCuts: SaveShortCutsDto[],
    loginUser: UsersModel;
}

export interface ResponseTypeForSaveShorts {
    success: boolean;
    message: string;
}