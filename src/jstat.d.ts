declare module "jstat" {
  export const jStat: {
    studentt: {
      cdf(t: number, df: number): number;
    };
  };
}
