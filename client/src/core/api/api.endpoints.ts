export const apiRoutes = {
  auth: {
    refresh: (): string => `/auth/refresh`,
    signIn: (): string => `/auth/signin`,
    logout: (): string => `/auth/logout`,
    changePassword: (): string => `/auth/change-password`,
  },

  invidious: {
    create: (): string => '/invidious',
    delete: (id: number): string => `/invidious/${id}`,
    deleteBulk: (): string => `/invidious/delete-bulk`,
    findOne: (id: number): string => `/invidious/${id}`,
    getLogs: (id: number): string => `/invidious/${id}/logs`,
    healthCheck: (id: number): string => `/invidious-parser/health-check/${id}`,
    healthCheckAll: (): string => `/invidious-parser/health-check-all`,
    resetState: (): string => '/invidious/reset-hosts-state',
    loadHosts: (): string => '/invidious-parser/load-hosts',
    search: (): string => '/invidious/search',
    update: (id: number): string => `/invidious/${id}`,
  },

  proxy: {
    clear: (): string => `/proxy/clear`,
    createBulk: (): string => `/proxy/create-bulk`,
    delete: (id: number): string => `/proxy/${id}`,
    deleteBulk: (): string => `/proxy/delete-bulk`,
    findOne: (id: number): string => `/proxy/${id}`,
    search: (): string => '/proxy/search',
    update: (id: number): string => `/proxy/${id}`,
  },

  safeWord: {
    clear: (): string => `/safe-word/clear`,
    createBulk: (): string => `/safe-word/create-bulk`,
    delete: (id: number): string => `/safe-word/${id}`,
    deleteBulk: (): string => `/safe-word/delete-bulk`,
    findOne: (id: number): string => `/safe-word/${id}`,
    search: (): string => '/safe-word/search',
    update: (id: number): string => `/safe-word/${id}`,
  },

  settings: {
    findAll: (): string => '/settings',
    updateBulk: (): string => '/settings/update-bulk',
    resetCache: (): string => '/settings/reset-cache',
  },

  useragent: {
    clear: (): string => `/useragents/clear`,
    createBulk: (): string => `/useragents/create-bulk`,
    delete: (id: number): string => `/useragents/${id}`,
    deleteBulk: (): string => `/useragents/delete-bulk`,
    findAll: (): string => '/useragents',
    findOne: (id: number): string => `/useragents/${id}`,
    search: (): string => '/useragents/search',
    update: (id: number): string => `/useragents/${id}`,
  },

  domain: {
    clear: (): string => `/domain/clear`,
    create: (): string => `/domain`,
    delete: (id: number): string => `/domain/${id}`,
    deleteBulk: (): string => `/domain/delete-bulk`,
    findAll: (): string => '/domain',
    findOne: (id: number): string => `/domain/${id}`,
    search: (): string => '/domain/search',
    update: (id: number): string => `/domain/${id}`,
  },

  apiKey: {
    clear: (): string => `/api-key/clear`,
    create: (): string => `/api-key`,
    delete: (id: number): string => `/api-key/${id}`,
    deleteBulk: (): string => `/api-key/delete-bulk`,
    findAll: (): string => '/api-key',
    findOne: (id: number): string => `/api-key/${id}`,
    search: (): string => '/api-key/search',
    update: (id: number): string => `/api-key/${id}`,
  },
}
