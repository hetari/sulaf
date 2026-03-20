export type Links = {
  github: string
  githubAPI: string
  x: string
}

export type SiteConfig = {
  name: string
  url: string
  // ogImage: string
  description: string
  links: Links
}

const repoUrl = 'https://github.com/hetari/sulaf'

export const siteConfig: SiteConfig = {
  name: 'sulaf',
  url: repoUrl,
  // ogImage: 'https://raw.githubusercontent.com/hetari/sulaf/master/public/og.png',
  description:
    'Simple, powerful and flexible site generation framework with everything you love from Nuxt.js & Shadcn Vue',
  links: {
    github: repoUrl,
    githubAPI: 'https://api.github.com/repos/hetari/sulaf',
    x: 'https://x.com/hetari',
  },
}
