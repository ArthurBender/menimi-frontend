export function capitalize(value: string) {
  return value ? value[0].toUpperCase() + value.slice(1) : value;
}
