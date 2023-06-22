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
    create: (): string => `/api-key/create`,
    edit: (id: number | string = ':id'): string => `/api-key/edit/${id}`,
    index: (): string => `/api-key`,
    view: (id: number | string = ':id'): string => `/api-key/view/${id}`,
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
