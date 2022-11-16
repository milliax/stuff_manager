module.exports = {
  apps : [{
    name: 'milliax.me',
    script: 'yarn',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    max_memory_restart:  '1G',
    watch: false,
    env_production:{
      NODE_ENV: 'production',
      PORT:5001
    }
  }]
};
