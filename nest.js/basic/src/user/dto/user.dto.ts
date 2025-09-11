
import { IsString, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class UserDto {


    @Transform(({ value }) => {
        if ( value === 'string') return 'siya';
        return value;
        })

    @IsString()
    @MinLength(3)

    name: string;
}