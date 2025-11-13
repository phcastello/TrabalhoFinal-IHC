const triggerDownload = (filename: string, content: BlobPart, type = 'text/plain;charset=utf-8') => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const downloadTxt = (filename: string, content: string) =>
  triggerDownload(filename, content, 'text/plain;charset=utf-8')

export const downloadCsv = (filename: string, rows: string[][]) => {
  const csv = rows.map((cols) => cols.map((col) => `"${col}"`).join(';')).join('\n')
  triggerDownload(filename, csv, 'text/csv;charset=utf-8')
}
