import {IsEmail, IsLowercase, IsNotEmpty, IsString, Length, MaxLength, MinLength} from "class-validator";
import {Transform} from "class-transformer";

const bcrypt = require('bcrypt');

export class CreateUserDto {
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    @IsLowercase()
    readonly username: string;

    @IsEmail()
    @MaxLength(30)
    @IsNotEmpty()
    readonly email: string;

    @Transform((value) => bcrypt.hashSync(value.value, 10))
    @IsString()
    @Length(6, 80)
    @IsNotEmpty()
    readonly password: string;
}