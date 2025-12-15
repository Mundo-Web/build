import General from './General';

const Number2Currency = (number, currency = 'en-US') => {
  return (Number(number) || 0)
    .toLocaleString(currency, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })
}

export const CurrencySymbol = () => {
  const currency = General.get('currency') || 'pen';
  switch (currency) {
    case 'usd':
      return '$';
    case 'pen':
      return 'S/';
    default:
      return 'S/';
  }
}

export default Number2Currency