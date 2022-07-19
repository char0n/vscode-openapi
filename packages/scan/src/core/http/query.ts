export function encode(data: any) {
  const result: any = {};
  for (const parameterName of Object.keys(data)) {
    for (const [key, value] of formatKeyValue(parameterName, data[parameterName])) {
      result[key] = value;
    }
  }

  return Object.entries(result)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}

function formatKeyValue(key: string, value: unknown): [string, string][] {
  const encodedKey = formatKey(key);
  return [[encodedKey, encodeURIComponent(String(value))]];
}

function formatKey(key: string): string {
  return encodeURIComponent(key);
}
