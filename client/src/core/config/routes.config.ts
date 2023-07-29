export const browseRoutes = {
  auth: {
    login: (): string => `/login`,
  },

  user: {
    profile: (): string => `/profile`,
  },

  base: {
    home: (): string => `/`,
    notFound: (): string => `*`,
  },

  invidious: {
    create: (): string => `/invidious/create`,
    edit: (id: number | string = ':id'): string => `/invidious/edit/${id}`,
    index: (): string => `/invidious`,
    view: (id: number | string = ':id'): string => `/invidious/view/${id}`,
  },

  proxy: {
    create: (): string => `/proxy/create`,
    edit: (id: number | string = ':id'): string => `/proxy/edit/${id}`,
    index: (): string => `/proxy`,
    view: (id: number | string = ':id'): string => `/proxy/view/${id}`,
  },

  apiKey: {
    create: (): string => `/access-keys/create`,
    edit: (id: number | string = ':id'): string => `/access-keys/edit/${id}`,
    index: (): string => `/access-keys`,
    view: (id: number | string = ':id'): string => `/access-keys/view/${id}`,
  },

  youtubeApiey: {
    create: (): string => `/youtube-apikey/create`,
    edit: (id: number | string = ':id'): string => `/youtube-apikey/edit/${id}`,
    index: (): string => `/youtube-apikey`,
    view: (id: number | string = ':id'): string => `/youtube-apikey/view/${id}`,
  },

  safeWords: {
    create: (): string => `/safe-word/create`,
    edit: (id: number | string = ':id'): string => `/safe-word/edit/${id}`,
    index: (): string => `/safe-word`,
    view: (id: number | string = ':id'): string => `/safe-word/view/${id}`,
  },

  settings: {
    view: (): string => `/settings/view`,
  },

  useragent: {
    create: (): string => `/useragents/create`,
    edit: (id: number | string = ':id'): string => `/useragents/edit/${id}`,
    index: (): string => `/useragents`,
    view: (id: number | string = ':id'): string => `/useragents/view/${id}`,
  },

  domain: {
    create: (): string => `/domains/create`,
    edit: (id: number | string = ':id'): string => `/domains/edit/${id}`,
    index: (): string => `/domains`,
    view: (id: number | string = ':id'): string => `/domains/view/${id}`,
  },
}
