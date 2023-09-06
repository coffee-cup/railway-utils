for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith("RAILWAY")) {
    console.log(`${key} = ${value}`);
  }
}
