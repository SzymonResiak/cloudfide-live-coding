import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type TradeDocument = Trade & Document;

@Schema({ timestamps: true })
export class Trade {
    @Prop({required: true, index: true})
    symbol: string

    @Prop({required: true})
    price: string

    @Prop({required: true})
    qty: string

    @Prop({required: true})
    time: number

    @Prop({required: true})
    isBuyerMaker: boolean
}
export const TradeSchema = SchemaFactory.createForClass(Trade);