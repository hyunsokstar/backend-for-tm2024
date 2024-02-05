import { Module } from '@nestjs/common';
import { CloudflareController } from './cloudflare.controller';
import { CloudflareService } from './cloudflare.service';

@Module({
  controllers: [CloudflareController],
  providers: [CloudflareService]
})
export class CloudflareModule { }
