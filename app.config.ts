export default defineAppConfig({
  ui: {
    // red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose
    primary: 'blue',
    // slate, zinc, neutral, stone, gray
    gray: 'neutral',
    notifications: {
      position: 'top-0 right-0',
    },
    button: {
      default: {
        size: 'md',
      },
    },
    table: {
      default: {
        sortMode: 'manual',
      },
      th: {
        base: 'text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground',
        padding: 'px-4 py-3.5',
      },
      td: {
        padding: 'px-4 py-3.5',
      },
    },
    card: {
      base: 'bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800',
      divide: 'divide-y divide-zinc-200 dark:divide-zinc-800',
      header: {
        base: 'px-4 sm:px-6 py-4',
        padding: 'px-4 sm:px-6 py-4',
      },
      body: {
        base: 'px-4 sm:px-6 py-4',
        padding: 'px-4 sm:px-6 py-4',
      },
      footer: {
        base: 'px-4 sm:px-6 py-4',
        padding: 'px-4 sm:px-6 py-4',
      },
    },
    modal: {
      base: 'bg-white dark:bg-zinc-900 shadow-xl',
      overlay: {
        base: 'bg-zinc-900/50 backdrop-blur-sm',
      },
    },
    badge: {
      default: {
        size: 'xs',
      },
    },
    input: {
      default: {
        size: 'sm',
      },
    },
    select: {
      default: {
        size: 'sm',
      },
    },
    textarea: {
      default: {
        size: 'sm',
      },
    },
  },
})
