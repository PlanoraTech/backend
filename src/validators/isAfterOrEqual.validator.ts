import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";

@ValidatorConstraint({ name: "isAfter", async: false })
export class IsAfterOrEqual implements ValidatorConstraintInterface {

    validate(propertyValue: string, args: ValidationArguments) {
        return propertyValue >= args.object[args.constraints[0]];
    }

    defaultMessage(args: ValidationArguments) {
      return `'${args.property}' must be after or equal to '${args.constraints[0]}'`;
    }
}