import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { PriceAnalysisDto } from './dto/price-analysis.dto'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class PriceAnalysisService {
    private readonly logger = new Logger(PriceAnalysisService.name)
    private readonly binanceBaseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.binanceBaseUrl = this.configService.get<string>(
            'BINANCE_API_URL',
            'https://api.binance.com/api/v3/'
        )
        this.logger.log(`Using BinanceAPI URL: ${this.binanceBaseUrl}`)
    }

    async fetchAndAnalyzeSymbol(
        symbol: string,
        interval: string = '1h',
        limit: number = 100
    ): Promise<PriceAnalysisDto> {
        const upperCaseSymbol = symbol.toUpperCase();
        const endpoint = `${this.binanceBaseUrl}/klines`
        const params = { symbol: upperCaseSymbol, interval, limit }

        this.logger.log(
            `Fetching ${limit} ${interval} klines for ${upperCaseSymbol} from ${endpoint}`
        )

        try {
            const response = await firstValueFrom(this.httpService.get<any[]>(endpoint, { params }))

            const klines = response.data;
            if (!klines || klines.length === 0){
                this.logger.warn(
                    `No klines data received from symbol ${upperCaseSymbol}`
                )
                throw new NotFoundException(
                    `No klines data received from symbol ${upperCaseSymbol}`
                )
            }

            const firstKline = klines[0];
            const lastKline = klines[klines.length - 1];

            const startTime = firstKline[0]
            const endTime = lastKline[6]
            const startPrice = parseFloat(firstKline[1])
            const endPrice = parseFloat(lastKline[4])
            const dataPointsAnalyzed = klines.length

            if(isNaN(startPrice) || isNaN(endPrice) || startPrice === 0) {
                this.logger.error(
                    `Invalida price data received for symbol ${upperCaseSymbol}: start: ${startPrice}, end:${endPrice}`
                )
                throw new InternalServerErrorException(
                    `Invalida price data received for symbol: ${upperCaseSymbol}`
                )
            }

            const percentageChange = ((endPrice - startPrice) / startPrice) * 100;
            const message = `Price ${percentageChange >= 0 ? 'increased' : 'decreased'} by ${percentageChange.toFixed(2)}% over the last ${dataPointsAnalyzed} periods.`
            this.logger.log(
                `Analysis for ${upperCaseSymbol}: ${message}`
            )

            return {
                symbol: upperCaseSymbol,
                startTime,
                endTime,
                startPrice,
                endPrice,
                percentageChange,
                dataPointsAnalyzed,
                message
            }
        } catch (error) {
            
        }
    }
}