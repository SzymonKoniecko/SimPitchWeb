const mapping = [
  "", // index 0 unused
  "first", "second", "third", "fourth", "fifth", "sixth",
  "seventh", "eighth", "ninth", "tenth",
  "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth",
  "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth",
  "twenty-first", "twenty-second", "twenty-third", "twenty-fourth",
  "twenty-fifth", "twenty-sixth", "twenty-seventh", "twenty-eighth",
  "twenty-ninth", "thirtieth", "thirty-first", "thirty-second",
  "thirty-third", "thirty-fourth", "thirty-fifth", "thirty-sixth",
  "thirty-seventh", "thirty-eighth", "thirty-ninth", "fortieth"
];

export function MapNumberToText(n: number) {
  return mapping[n] ?? "unknown";
}
