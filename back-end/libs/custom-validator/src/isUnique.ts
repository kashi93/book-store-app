import { Injectable } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

type IsUniqueArg<WhereInput> = {
    model: Prisma.ModelName
    condition: WhereInput
}

@ValidatorConstraint({ async: true })
@Injectable()
class IsUniqueConstraint<WhereInput> implements ValidatorConstraintInterface {
    async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        try {
            const [arg] = validationArguments.constraints;

            if (typeof arg !== "function") return false;

            const prisma = new PrismaClient()
            const { model, condition }: IsUniqueArg<WhereInput> = arg(value, validationArguments.object);

            return await prisma[model].count({
                where: condition
            }) == 0;
        } catch (error) {
            console.log(error);

            return false;
        }
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        const field: string = validationArguments.property
        return `The ${field} has already been taken`
    }
}

export function IsUnique<WhereInput>(args: (value: string, property?: { [key: string]: any }) => IsUniqueArg<WhereInput>, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [args],
            validator: IsUniqueConstraint<WhereInput>,
        })
    }
}

