import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '../config/config.module'
import { ConfigService } from '../config/config.service'
import { Trade, TradeSchema } from '../database/schemas/trade.schema'

@Module({
    imports:[
        MongooseModule.forRootAsync({
            imports:[ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.getMongoUri(),
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([{ name: Trade.name, schema: TradeSchema}])
    ],
    exports:[
        MongooseModule.forFeature([{ name: Trade.name, schema: TradeSchema}])
    ],
})
export class DatabaseModule {}