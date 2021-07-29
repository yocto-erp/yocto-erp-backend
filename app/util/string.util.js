import numeral from 'numeral';

export function generateRandomCode(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export function generateRandomUpperCode(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < length; i += 1)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export function formatMoney(amount, currencyCode) {
  return `${numeral(amount).format('0,0.00[000000]')} ${currencyCode}`;
}

export function binary2hex(obj) {
  return Buffer.from(obj, 'hex').toString('hex');
}

export function hex2binary(obj) {
  return Buffer.from(obj, 'hex');
}

export function hasText(str){
  return str && str.length && str.trim().length
}
