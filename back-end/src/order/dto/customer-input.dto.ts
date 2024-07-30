import { IsNotEmpty, IsOptional } from "class-validator";

export class CustomerInputDto {
    @IsOptional()
    id?: string

    @IsNotEmpty()
    firstName: string

    @IsNotEmpty()
    lastName: string

    @IsOptional()
    address?: string

    @IsOptional()
    city?: string

    @IsOptional()
    country?: string

    @IsOptional()
    postalCode?: string
}