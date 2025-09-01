import posthog from 'posthog-js'

export const initPosthog = () => {
  posthog.init('phc_WTB4DQ5my6Jjs4oYF1YVOQYVjGTA7aUP9uipudyIev3',
    {
      api_host: 'https://us.i.posthog.com',
      defaults: '2025-05-24',
    }
  )
}
