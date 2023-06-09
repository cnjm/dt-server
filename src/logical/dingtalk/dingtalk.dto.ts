import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DelAccountDto {
  @ApiProperty({ description: "id" })
  @IsNotEmpty({ message: "id不能为空" })
  readonly id: string;
}
