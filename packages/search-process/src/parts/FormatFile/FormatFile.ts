export const formatFile = (text: string): string => {
  if (text.startsWith('./')) {
    return text.slice(2)
  }
  return text
}
