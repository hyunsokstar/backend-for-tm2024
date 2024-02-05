declare module 'express' {
    interface Request {
        user?: any; // 또는 원하는 타입으로 설정
    }
}