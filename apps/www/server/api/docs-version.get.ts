export default defineEventHandler(event => {
  const config = useRuntimeConfig(event)

  // Set cache headers directly in the handler
  setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=300')

  return {
    version: config.docsVersion ?? 'unknown',
  }
})
