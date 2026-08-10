import logoImage from '../assets/images/logo.png'

export const siteConfig = {
  preloader: {
    type: 'logo', // Change to "text" to use the wordmark preloader.
    text: 'EDYN',
    logoSrc: logoImage,
    minimumDuration: 1200,
  },
}
