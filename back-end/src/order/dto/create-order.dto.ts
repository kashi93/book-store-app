import { IsArray, IsIn, IsNotEmpty, IsNumber, IsObject, ValidateNested } from "class-validator";
import { CustomerInputDto } from "./customer-input.dto";
import { OrderItemInputDto } from "./order-item-input.dto";
import { Type } from "class-transformer";
import { $Enums } from "@prisma/client";

export class CreateOrderDto {
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    totalAmount: number

    @IsNotEmpty()
    @IsIn(["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"] satisfies $Enums.OrderStatus[])
    status: $Enums.OrderStatus

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => CustomerInputDto)
    customer: CustomerInputDto

    @IsNotEmpty()
    @IsArray()
    @ValidateNested()
    @Type(() => OrderItemInputDto)
    orderItems: OrderItemInputDto[]
}
