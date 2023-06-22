type ContentTypeObject = Record<string, string>

export const getContentType = (): ContentTypeObject => ({
  'Content-Type': 'application/json',
})
