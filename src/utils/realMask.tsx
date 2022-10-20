import createNumberMask from "text-mask-addons/dist/createNumberMask";

export const realMask = createNumberMask({
  prefix: "R$ ",
  thousandsSeparatorSymbol: ".",
  allowDecimal: true,
  decimalSymbol: ","
});
