// dtoForChangePagesOrderForSkilNote.ts

export interface DtoForChangePagesOrderForSkilNoteContent {
    skilNoteId: number;
    targetOrder: number; // 이동할 페이지의 현재 순서
    destinationOrder: number; // 이동할 페이지의 목적지 순서
}
