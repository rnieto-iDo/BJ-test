export type CardType = {
  id: string;
  title: string;
  description: string;
  image: any;
  imageComponent?: JSX.Element;
  onClick?: () => void;
};
