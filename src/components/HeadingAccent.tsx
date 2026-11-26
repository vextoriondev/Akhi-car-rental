/** Paints the closing words of a headline gold, whatever text the CMS holds. */
export function HeadingAccent({ text }: { text: string }) {
  const words = text.trim().split(/\s+/)
  if (words.length < 2) return <>{text}</>
  const split = words.length - Math.max(1, Math.round(words.length / 3))
  return (
    <>
      {words.slice(0, split).join(' ')} <em>{words.slice(split).join(' ')}</em>
    </>
  )
}
