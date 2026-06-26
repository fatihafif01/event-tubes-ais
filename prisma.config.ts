import { defineConfig } from '@prisma/client'

export default defineConfig({
  migrate: {
    async url() {
      return process.env.DATABASE_URL!
    },
  },
})