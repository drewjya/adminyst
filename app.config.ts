export default defineAppConfig({
  ui: {
    strategy: "override",
    notifications: {
      // Show toasts at the top right of the screen
      position: "top-0 end-0",
    },
    select: {
      color: {
        white: {
          outline:
            " ring-1 shadow-sm ring-gray-300 focus:ring-1 focus:ring-gray-300",
        },
      },
    },
    card: {
      header: {
        padding: "p-2",
      },
      body: {
        padding: "p-2 ",
      },
      footer: {
        padding: "p-2",
      },
    },
    input: {
      color: {
        white: {
          outline:
            " ring-1 shadow-sm ring-gray-300 focus:ring-1 focus:ring-gray-300",
        },
      },
    },
  },
});
