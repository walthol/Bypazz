// pages/_app.js
import HiddenAdmin from '../components/HiddenAdmin';
import GlobalBanner from '../components/GlobalBanner'; // Assuming you have this from earlier!
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalBanner />
      <HiddenAdmin />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
