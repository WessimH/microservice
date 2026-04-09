import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateMailDto {
    @IsEmail({}, { message: 'L\'email est invalide' })
    @IsNotEmpty({ message: 'L\'email est obligatoire' })
    email: string;

    @IsString()
    @IsOptional()
    subject?: string;

    @IsString()
    @IsNotEmpty({ message: 'Le contenu du mail est obligatoire' })
    html: string;
}