import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PriceAnalysisService } from "./price-analysis.service";
import { PriceAnalysisDto } from "./dto/price-analysis.dto";
import { DefaultValuePipe, ParseIntPipe, Query, Param, Get, Logger, Controller } from "@nestjs/common";
import { interval } from "rxjs";

@ApiTags('Price Analysis')
@Controller("analysis")
export class PriceAnalysisController {
    private readonly logger = new Logger(PriceAnalysisController.name);

    constructor(private readonly priceAnalysisService: PriceAnalysisService) {}

    @Get(':symbol')
    @ApiOperation({
        summary: '',
        description: ''
    })
    @ApiParam({
        name: 'symbol',
        required: true,
        description: '',
        example: 'BTCUSDT',
        type: String,
    })
    @ApiQuery({
        name: 'interval',
        required: false,
        description: '',
        example: '1h',
        type: String,
        enum: [
            '1m',
            '3m',
            '5m',
            '15m',
            '30m',
            '1h',
            '2h',
            '4h',
            '6h,',
            '8h',
            '12h',
            '1d',
            '3d',
            '1w',
            '1M'
        ]
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: "number of data points for fetch and analyze",
        example: 100,
        type: Number,
    })
    @ApiResponse({
        status: 200,
        description: "Analysis successful",
        type: PriceAnalysisDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Symbol not found of rada not avaliable'
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error during data fetching or analysis'
    })
    async getPriceAnalysis(
        @Param('symbol') symbol: string,
        @Query('interval', new DefaultValuePipe('1h')) interval: string,
        @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    ): Promise<PriceAnalysisDto> {
        const upperCaseSymbol = symbol.toUpperCase()
        this.logger.log(
            `Received request to analyze ${upperCaseSymbol}, with interval= ${interval}, and limit=${limit}`
        )

        const analysisResult = await this.priceAnalysisService.fetchAndAnalyzeSymbol(
            upperCaseSymbol,
            interval,
            limit,
        )

        return analysisResult;
    }
}