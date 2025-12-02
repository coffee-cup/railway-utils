export function getVariables(): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("RAILWAY_") && value !== undefined) {
      vars[key] = value;
    }
  }

  if (process.env.PORT) {
    vars.PORT = process.env.PORT;
  }

  return vars;
}

export function toEnvFormat(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
}
