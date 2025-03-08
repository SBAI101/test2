# Nuxt 3 Minimal Starter

## Development Notes

### TypeScript Checking Configuration

During development, we've disabled the Vue TypeScript compiler (`vue-tsc`) and related Volar dependencies to improve development performance. For production deployment, the following steps should be taken:

1. Install required TypeScript checking dependencies:
```bash
npm install -D vue-tsc @volar/vue-typescript
```

2. Update `nuxt.config.ts` to enable type checking:
```ts
typescript: {
  strict: true,
  typeCheck: true  // Enable this for production
}
```

These changes should be made before deploying to production to ensure proper type checking and validation.

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
