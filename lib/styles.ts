export function getColor(value: number): string {
  const colors: { [key: number]: string } = {
    2: "bg-neutral-100 text-neutral-800",
    4: "bg-neutral-200 text-neutral-800",
    8: "bg-orange-300 text-white",
    16: "bg-orange-400 text-white",
    32: "bg-orange-500 text-white",
    64: "bg-orange-600 text-white",
    128: "bg-yellow-400 text-white",
    256: "bg-yellow-500 text-white",
    512: "bg-yellow-600 text-white",
    1024: "bg-yellow-700 text-white",
    2048: "bg-yellow-800 text-white",
  };
  return colors[value] || "bg-yellow-900 text-white";
}