export default function random(len: number): string {
  const options = "abcdefghijklmnopqrstuvwxyz0123456789";

  let ans = "";

  for (let i = 0; i < len; i++) {
    ans += options[Math.floor(Math.random() * options.length)];
  }

  return ans;
}
