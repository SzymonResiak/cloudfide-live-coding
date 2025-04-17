import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { PriceAnalysisController } from './price-analysis.controller'
import { PriceAnalysisService } from './price-analysis.service'

import { ConfigModule } from '@nestjs/config'

@Module({
    imports:[ HttpModule, ConfigModule],
    controllers:[PriceAnalysisController],
    providers:[PriceAnalysisService]
})
export class PriceAnalysisModule {}