const IMPORT_REGEX = /@\/[^/]+\/((?:.*?\/)?(?:components|ui|composables|lib))\/([\w-]+)/g

const replacement = (...args: any[]) => {
  const [match, type, component] = args

  if (type.endsWith('components')) {
    return `@/components/${component}`
  } else if (type.endsWith('ui')) {
    return `@/components/ui/${component}`
  } else if (type.endsWith('composables')) {
    return `@/composables/${component}`
  } else if (type.endsWith('lib')) {
    return `@/lib/${component}`
  }

  return match
}

export function fixImport(content: string): string {
  return content.replace(IMPORT_REGEX, replacement)
}
