export function colorTemperatureToRGB(kelvin: number) {
  let temp = kelvin / 100;
  let red: number, green: number, blue: number;

  if (temp <= 66) {
    red = 255;
    green = temp;
    green = 99.4708025861 * Math.log(green) - 161.1195681661;
    if (temp <= 19) {
      blue = 0;
    } else {
      blue = temp - 10;
      blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
    }
  } else {
    red = temp - 60;
    red = 329.698727446 * Math.pow(red, -0.1332047592);
    green = temp - 60;
    green = 288.1221695283 * Math.pow(green, -0.0755148492);
    blue = 255;
  }

  const r = Math.round(clamp(red, 0, 255));
  const g = Math.round(clamp(green, 0, 255));
  const b = Math.round(clamp(blue, 0, 255));

  const hex = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

  const K = RGBToColorTemperature(hex);

  console.log(`inputK: ${kelvin}, parsedK: ${K}`);

  return hex;
}

export function RGBToColorTemperature(hex: string): number {
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);
  let retK = 0;

  if (red === 255) {
    const K = Math.round(Math.pow(Math.E, (green + 161.1195681661) / 99.4708025861));
    retK = K;
  } else if (blue === 255) {
    const K = Math.round(Math.pow(red / 329.698727446, 1 / -0.1332047592) + 60);
    retK = K;
  }

  return retK * 100;
}

export function clamp(x: number, min: number, max: number) {
  if (x < min) {
    return min;
  }
  if (x > max) {
    return max;
  }
  return x;
}

export function lerpColor(a: string, b: string, amount: number) {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);

  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);

  const red = Math.round(ar + amount * (br - ar));
  const green = Math.round(ag + amount * (bg - ag));
  const blue = Math.round(ab + amount * (bb - ab));

  return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
}
