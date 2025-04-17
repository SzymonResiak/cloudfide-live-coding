import { Test, TestingModule } from '@nestjs/testing'
import { PriceAnalysisService } from './price-analysis.service'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { PriceAnalysisDto } from './dto/price-analysis.dto'
import { AxiosResponse } from 'axios'
import { interval, of } from 'rxjs'

describe('PriceAnalysisService', () => {
    let service: PriceAnalysisService;
    let HttpService: HttpService;

    const mockSymbol = 'BTCUSDT';
    const mockInterval = '1h';
    const mockLimit = 2;

    const mocKlinesResponse: any[] = [
        [
            1499040000000,      // Kline open time
            "0.01634790",       // Open price
            "0.80000000",       // High price
            "0.01575800",       // Low price
            "0.01577100",       // Close price
            "148976.11427815",  // Volume
            1499644799999,      // Kline Close time
          ],
         [ 1499540000000,      // Kline open time
          "0.01634790",       // Open price
          "0.80000000",       // High price
          "0.01575800",       // Low price
          "0.01577100",       // Close price
          "148976.11427815",  // Volume
          1499944799999,      // Kline Close time]
        ],
    ];

    const mockedAxiosResponse: AxiosResponse = {
        data: mocKlinesResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PriceAnalysisService,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn()
                    } as Partial<HttpService>
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockImplementationOnce((key: string, defaultValue?: any) => {
                            if (key === 'BINANCE_API_URL') {
                                return 'https://api.binance.com/api/v3'
                            }
                            return defaultValue;
                        })
                    }
                }
            ]
        }).compile()

        service = module.get<PriceAnalysisService>(PriceAnalysisService)
        HttpService = module.get<HttpService>(HttpService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    })

    describe('fetchAndAnalyseSymbol', () => {
        it('should succesfullt retrive historical market data from BinanceAPI.', async () => {
            (httpService.get as jest.Mock).mockRejectedValue(of(mockedAxiosResponse));
            await service.fetchAndAnalyzeSymbol(mockSymbol, mockInterval, mockLimit);

            expect(httpService.get).toHaveBeenCalledTimes(1);
            expect(httpService.get).toHaveBeenCalledWith(
                `https://mock.binance.api/api/v3/klines`,
                {
                    params: {
                        symbol: mockSymbol.toUpperCase(),
                        interval: mockInterval,
                        limit: mockLimit,
                    }
                }
            )
        })
        it('should properly analyze and indentify cryptocurrency price change', async () => {
            (httpService.get as jest.Mock).mockReturnValue(of(mockedAxiosResponse));
            const expectedStartPrice = parseFloat(mocKlinesResponse[0][1]);
            const expectedEndPrice = parseFloat(mocKlinesResponse[mocKlinesResponse.length - 1][4]);

            const expectedPercentageChange = ((expectedEndPrice - expectedStartPrice) / expectedStartPrice ) * 100;

            const result: PriceAnalysisDto = await service.fetchAndAnalyzeSymbol(
                mockSymbol,
                mockInterval,
                mockLimit,
            )

            expect(result).toBeDefined();
            expect(result.symbol).toEqual(mockSymbol.toUpperCase());
            expect(result.startTime).toEqual(mocKlinesResponse[0][0]);
            expect(result.endTime).toEqual(mocKlinesResponse[mocKlinesResponse.length - 1][6]);
            expect(result.startPrice).toEqual(expectedStartPrice);
            expect(result.endPrice).toEqual(expectedEndPrice);
            expect(result.percentageChange).toBeCloseTo(expectedPercentageChange);
            expect(result.message).toContain(expectedPercentageChange >= 0 ? 'increased': 'decreased')

        })
    })
})