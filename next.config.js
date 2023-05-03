module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://docs.alexanderiscoding.com/cloudfirebase/introduction',
        permanent: true,
      },
    ]
  },
}