export const connectionString = process.env.DATABASE_URL || 'mongodb://mymetrics_tester:metricstest123@ds227168.mlab.com:27168/my_metrics';

export const googleConfig = {
  clientID: '50422910844-k6mahl2eal1ntpnoeunbevg753o5f5i0.apps.googleusercontent.com',
  clientSecret: 'A2YtKP0JVpPK9DZu7Rb4rZQ',
  callbackURL: 'http://localhost:3000/auth/google/callback'
};