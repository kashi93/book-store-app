import { IsIn, IsNotEmpty } from "class-validator";
import { $Enums } from "@prisma/client";

export class ChangeStatusInputDto {
    @IsNotEmpty()
    id: number

    @IsNotEmpty()
    @IsIn(["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"] satisfies $Enums.OrderStatus[])
    status: $Enums.OrderStatus
}
