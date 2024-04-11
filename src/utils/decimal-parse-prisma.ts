import { Decimal, DecimalJsLike } from "@prisma/client/runtime/library";

function saveNumberToPrismaDecimal(value: string | number | Decimal | DecimalJsLike) {
  return new Decimal(value.toString());
}

export { saveNumberToPrismaDecimal };
