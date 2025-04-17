import { ApiProperty } from '@nestjs/swagger'

export class PriceAnalysisDto {
    @ApiProperty({
        description: 'Trading symbol',
        example: 'BTCUSDT'
    })
    symbol: string;

    @ApiProperty({
        description: 'Timestamp oof the start of the analysis period in ms.',
        example: 123123123213123
    })
    startTime: number;

    @ApiProperty({
        description: 'Timestamp oof the end of the analysis period in ms.',
        example: 123123123213123
    })
    endTime: number;

    @ApiProperty({
        description: 'Price at the start of period',
        example: 28000.5
    })
    startPrice: number;

    @ApiProperty({
        description: 'Price at the end of period',
        example: 28001.5
    })
    endPrice: number;

    @ApiProperty({
        description: 'Percentage change in price',
        example: 0.5
    })
    percentageChange: number;

    @ApiProperty({
        description: 'Number of data points analized (using candles)',
        example: 40
    })
    dataPointsAnalyzed: number

    @ApiProperty({
        description: 'A summary of the analysis',
        example: 'Price increased by 0.5% over the period'
    })
    message: string;
}