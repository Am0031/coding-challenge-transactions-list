export const isValidField = (type: string, value: string | number) => {
  switch (type) {
    case "sender":
    case "recipient":
      if (typeof value === "string") {
        const regex: RegExp = /^0x[0-9a-fA-F]{40}$/;
        return regex.test(value);
      }
      return false;

    case "amount":
      if (typeof value === "number") {
        return value > 0;
      }
      if (typeof value === "string") {
        return JSON.parse(value) > 0;
      }
      return false;

    default:
      break;
  }
};
