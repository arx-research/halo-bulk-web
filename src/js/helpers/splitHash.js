export default function splitHash(str) {
  const last4 = str.substr(str.length - 4);
  const rest = str.slice(0, -4);
  return { start: rest, end: last4 };
}