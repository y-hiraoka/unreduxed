const getRandom = () => Math.floor(Math.random() * 255);

export function randomlyGetColor() {
  return `rgb(${getRandom()},${getRandom()},${getRandom()})`;
}
