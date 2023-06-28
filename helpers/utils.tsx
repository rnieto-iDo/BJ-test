export const roundPrice = (price: string) => {
  const formatter = Intl.NumberFormat();
  const formatedPrice = formatter.format(+price);

  return formatedPrice;
};

export const handleInputNumber = (
  value: string,
  regex: RegExp,
  changeFunction: () => void
) => {
  if (regex.test(value)) {
    changeFunction();
  }
};

export const truncateString = (text: string, limit: number) =>
  text?.length > limit ? `${text?.slice(0, limit)}...` : text;
