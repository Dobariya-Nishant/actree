function mountCriticalErrorHandlers() {
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception Custom:", err);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at Custom:", promise, "reason:", reason);
  });
}

export { mountCriticalErrorHandlers };
