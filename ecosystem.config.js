module.exports = {
  apps: [
    {
      name: 'garava-backend',
      script: './server/src/app.js',
      cwd: './',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      error_file: './server/logs/err.log',
      out_file: './server/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      max_memory_restart: '1G',
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'temp'],
      merge_logs: true
    },
    {
      name: 'garava-webhook',
      script: './server/webhook-server.cjs',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 9000
      },
      error_file: './server/logs/webhook-err.log',
      out_file: './server/logs/webhook-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      max_memory_restart: '256M'
    }
  ]
};
