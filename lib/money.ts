export const money = {
  toCents: (amount: number) => Math.round(amount * 100),
  fromCents: (cents: number) => cents / 100,
  format: (money: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(money),
}
