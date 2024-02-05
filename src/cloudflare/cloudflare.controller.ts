import { Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';


@Controller('cloudflare')
export class CloudflareController {
    constructor(private readonly configService: ConfigService) { }

    @Post('get-upload-url')
    async getUploadURL() {
        const cfId = this.configService.get<string>('CF_ID');
        const cfToken = this.configService.get<string>('CF_TOKEN');

        console.log("cfId : ", cfId);
        console.log("cfToken : ", cfToken);

        const url = `https://api.cloudflare.com/client/v4/accounts/${cfId}/images/v2/direct_upload`;
        const formData = new FormData();

        try {
            const response = await axios.post(
                url,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${cfToken}`,
                    },
                }
            );

            const result = response.data.result;

            return {
                id: result.id,
                uploadURL: result.uploadURL,
            };

        } catch (error) {
            // 에러 처리 로직 추가
            console.error('Error:', error.response.data);
            throw new Error('Failed to get upload URL');
        }
    }

}
