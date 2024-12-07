module.exports = {
    apps: [
      {
        name: "reservas-backend",
        script: "src/app/app.js",
        watch: true, // Opcional: reinicia si detecta cambios
        env: {
          NODE_ENV: "production", // Define el entorno
          PORT: 3001,            // Puerto que usa tu backend
        },
      },
    ],
  };
  