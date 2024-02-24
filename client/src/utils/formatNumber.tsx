import numeral from "numeral";

export const formattedNumberWithCommas = (num: number) =>
  numeral(num).format("0,0.00");

export const formattedNumberWithSpaces = (num: number) =>
  numeral(num).format("0 0.00");

export const convertToWei = (num: number) => {
  return num * 10 ** 18;
};

export const convertToEth = (num: number) => {
  return num / 10 ** 18;
};
