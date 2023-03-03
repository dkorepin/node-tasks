process.stdin.on("data", (data) => {
  const reversed = data
    .toString()
    .split('')
    .reverse()
    .join('');
  process.stdout.write(reversed + "\n");
});
