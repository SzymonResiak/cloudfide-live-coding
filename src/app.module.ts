import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PriceAnalysisModule } from './price-analysis/price-analysis.module';

@Module({
  imports: [DatabaseModule, ConfigModule, PriceAnalysisModule],
})
export class AppModule {}
