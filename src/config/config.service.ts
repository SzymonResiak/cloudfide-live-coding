import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from '@nestjs/config'

@Injectable()
export class ConfigService {
    constructor(private nestConfigService: NestConfigService) {}

    getMongoUri(): string {
        const uri = this.nestConfigService.get<string>('MONGODB_URI')
        if (!uri) {
            throw new Error(
                'MONGODB_URI is not defined in environment variables file.'
            )
        }
        return uri;
    }
}