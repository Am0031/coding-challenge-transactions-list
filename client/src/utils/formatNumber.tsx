import numeral from "numeral";

export const formattedNumberWithCommas = (num: number) =>
  numeral(num).format("0,0.00");

export const formattedNumberWithSpaces = (num: number) =>
  numeral(num).format("0 0.00");

export const convertToWei = (num: number | string) => {
  if (typeof num === "string") {
    return JSON.parse(num) * 10 ** 18;
  }
  return (num * 10 ** 18) as number;
};

export const convertToEth = (num: number | string) => {
  if (typeof num === "string") {
    return JSON.parse(num) / 10 ** 18;
  }
  return (num / 10 ** 18) as number;
};
