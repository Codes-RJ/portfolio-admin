const HEX_COLOR = /^#([0-9a-f]{6})$/i;

const shadeMixes: Record<number, { target: 0 | 255; amount: number }> = {
  50: { target: 255, amount: 0.94 },
  100: { target: 255, amount: 0.86 },
  200: { target: 255, amount: 0.72 },
  300: { target: 255, amount: 0.52 },
  400: { target: 255, amount: 0.28 },
  500: { target: 255, amount: 0 },
  600: { target: 0, amount: 0.14 },
  700: { target: 0, amount: 0.28 },
  800: { target: 0, amount: 0.42 },
  900: { target: 0, amount: 0.56 },
  950: { target: 0, amount: 0.7 },
};

export const createPrimaryColorScale = (hex: string): Record<number, string> => {
  const match = HEX_COLOR.exec(hex);
  if (!match) throw new Error('Primary color must be a six-digit hexadecimal color.');
  const channels = [0, 2, 4].map((offset) => Number.parseInt(match[1].slice(offset, offset + 2), 16));
  return Object.fromEntries(Object.entries(shadeMixes).map(([shade, { target, amount }]) => [
    Number(shade),
    channels.map((channel) => Math.round(channel + (target - channel) * amount)).join(' '),
  ]));
};

