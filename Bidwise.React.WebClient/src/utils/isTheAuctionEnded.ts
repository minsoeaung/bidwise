import dayjs from "dayjs";

export const isTheAuctionEnded = (endDate: string) => {
  return dayjs(endDate).diff(dayjs(), "second") <= 0;
};
