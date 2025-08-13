const maybeAddVariables = (variables: Record<string, string>, name: string) => {
  const value = process.env[name];
  if (value) {
    variables[name] = value;
  }
};

export const getVariables = () => {
  const variables: Record<string, string> = {};

  for (const [name, value] of Object.entries(process.env)) {
    if (name.startsWith("RAILWAY_") && value != null) {
      variables[name] = value;
    }
  }

  maybeAddVariables(variables, "PORT");
  return variables;
};

export const outputVariables = () => {
  const variables = getVariables();
  for (const [name, value] of Object.entries(variables)) {
    console.log(`${name} = ${value}`);
  }
  console.log("");
};

if (import.meta.main) {
  outputVariables();
}
