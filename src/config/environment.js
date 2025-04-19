const ENV = {
  dev: {
    apiUrl: 'http://localhost:8080/api',
    socketApiUrl: 'http://localhost:8080',
  },
  staging: {
    apiUrl: 'https://qrsaybackend-testing.onrender.com/api',
    socketApiUrl: 'https://qrsaybackend-testing.onrender.com',
  },
  prod: {
    apiUrl: 'https://qrsaybackend-36c9.onrender.com/api',
    socketApiUrl: 'https://qrsaybackend-36c9.onrender.com',
  }
};

const getEnvVars = (env = 'dev') => {
  if (env === 'staging') return ENV.staging;
  if (env === 'prod') return ENV.prod;
  return ENV.dev;
};

export default getEnvVars();
