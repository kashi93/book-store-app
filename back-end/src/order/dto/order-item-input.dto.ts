import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class OrderItemInputDto {
    @IsOptional()
    id?: string

    @IsOptional()
    deleted?: boolean

    @IsNotEmpty()
    bookId: string

    @IsNotEmpty()
    @IsInt()
    quantity: number

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    unitPrice: number
}