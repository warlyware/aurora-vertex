export const addCommasToNumber = (value: number | string) => {
  if (typeof value === "string" && !isNaN(parseFloat(value))) {
    value = parseFloat(value);
  } else {
    return value;
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
