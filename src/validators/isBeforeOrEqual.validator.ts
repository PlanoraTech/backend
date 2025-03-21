import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";

@ValidatorConstraint({ name: "isBefore", async: false })
export class IsBefore implements ValidatorConstraintInterface {

    validate(propertyValue: string, args: ValidationArguments) {
        return propertyValue <= args.object[args.constraints[0]];
    }

    defaultMessage(args: ValidationArguments) {
      return `'${args.property}' must be before or equal to '${args.constraints[0]}'`;
    }
}