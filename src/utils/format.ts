export const formatNumber = (num: number) => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return Math.floor(num).toString();
};

export const formatPps = (val: number) => {
  if (val === 0) return "0";
  if (val < 10) return val.toFixed(2);
  if (val < 100) return val.toFixed(1);
  return Math.round(val).toString();
};
