module.exports = {
  apps: [
    {
      name: "forever-healthcare-prod",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "forever-healthcare-dev",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
        PORT: 3001,
      },
    },
  ],
};
