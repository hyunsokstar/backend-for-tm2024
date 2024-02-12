declare module 'express' {
    interface Request {
        headers: any;
        user?: any; // 또는 원하는 타입으로 설정
    }
}