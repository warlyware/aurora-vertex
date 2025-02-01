import numeral from "numeral";

export const addCommasToNumber = (value: number | string | undefined | null) => {
  if (!value) return "NaN";

  if (typeof value === "string" && !isNaN(parseFloat(value))) {
    value = parseFloat(value);
  }
  return value.toLocaleString("en-US");
};

export const truncateDescription = (
  description: string,
  length: number = 300
) => {
  if (!description) return "";
  if (description.length <= length) return description;
  return `${description.slice(0, length)}...`;
};

export const logFormatter = (number: number) => {
  return numeral(number).format('0.00e+0');
}