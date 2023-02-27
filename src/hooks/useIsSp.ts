import { useMediaQuery } from "react-responsive";

export const useIsSp = (minWidth?: number) => {
  const isDesktop = useMediaQuery({ minWidth: minWidth ?? 768 });
  return !isDesktop;
};
