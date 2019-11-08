module.exports = {
  apps: [
    {
      name: "API",
      cwd: "./api",
      script: "./app.js",

      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    },
    {
      name: "frontend",
      cwd: "./frontend",
      script: "./startscript.js",

      // Options reference: http://pm2.keymetrics.io/docs/usage/application-declaration/
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      // error_file: './frontend_err.log',
      // out_file: './frontend_out.log',
      // log_file: './frontend_combined.log',
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],

  deploy: {
    production: {
      user: "wouterpot",
      host: [
        {
          host: process.env.HOST_URL,
          port: process.env.HOST_PORT
        }
      ],
      ref: "origin/master",
      repo: "git@github.com:pottootje1982/shopping.git",
      path: "/var/services/web/shopping",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production"
    }
  }
}
