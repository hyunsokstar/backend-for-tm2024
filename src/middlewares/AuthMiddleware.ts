import { Injectable, NestMiddleware, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(
        private readonly configService: ConfigService
    ) { }

    use(req: Request, res: any, next: Function) {
        const accessTokenSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
        // console.log("accessTokenSecret : ", accessTokenSecret);
        // console.log("미들웨어 실행 확인 ");

        // 헤더에서 토큰 추출
        const authHeader = req.headers['authorization'];
        // console.log("authHeader : ", authHeader);

        let token: string;
        token = authHeader && authHeader.split(' ')[1];
        // console.log("token 있나 ? : ", token);

        try {
            const decoded = jwt.verify(token, accessTokenSecret);
            // console.log("decoded : ", decoded);

            req['user'] = {
                id: decoded['id'],
                email: decoded['email']
            };

            console.log("req['user'] ::: ", req['user']);
            // if (req['user']) {
            //     next()
            // }

        } catch (error) {
            // console.log("error :?? ", error);
            // console.log("token 유효 기간 지남");

            // res.status(401).json({ message: error, reason: error });

            if (error.name === 'TokenExpiredError') {
                // next();
                // throw error
                // res.status(401).json({ message: '토큰이 만료되었습니다.', reason: 'ExpiredToken' });
            } else {
                // res.status(403).json({ status: "error", message: '인증 실패' });
                // next();
            }
        }

        next();
    }

}