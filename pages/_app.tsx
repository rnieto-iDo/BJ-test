import type { AppProps } from 'next/app';
import { FC } from 'react';
import { Provider } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import Link from 'next/link';
import Script from 'next/script';
import '@witt-team/athens-component-library/dist/styles/main.scss';
import { createEvent } from 'react-event-hook';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorHandler from './error-handler-page';

import TranslationWrapper from '../adapters/TranslationWrapper/TranslationWrapper';
import Footer from '../components/globals/Footer/Footer';
import { NavigationBar } from '../components/globals/Navbar/Navbar';
import { wrapper } from '../store/store';
import '../styles/globals.scss';

import SidebarWrapper from '../components/globals/SidebarWrapper';

import SearchBar from '../components/search/SearchBar';


export const getStaticProps = async ({ preview = false }) => ({
    props: { preview },
});

const MyApp: FC<AppProps> = ({ Component, ...rest }) => {
    const { store, props } = wrapper.useWrappedStore(rest);

    const { useNavbarEventListener, emitNavbarEvent } = createEvent('navbarEvent')<string>();

    return (
        <>
            <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />

            <Script id="google-analytics" strategy="afterInteractive">
                {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'GA_MEASUREMENT_ID');
            `}
            </Script>

            <Provider store={store}>
                <TranslationWrapper>
                    <NavigationBar eventEmiter={emitNavbarEvent} />
                    <SearchBar navbarEventListener={useNavbarEventListener} />
                    <SidebarWrapper />
                    <ErrorBoundary fallback={<ErrorHandler />}>
                        <div className="page-wrapper-container">
                            <Component {...props} />
                        </div>
                    </ErrorBoundary>

                    <Footer />
                    {props?.pageProps?.preview ? (
                        <Link
                            style={{
                                position: 'fixed',
                                bottom: 0,
                                right: 0,
                                width: 150,
                                height: 50,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: '#025cc7',
                                color: '#f4f4f4',
                                borderRadius: 5,
                            }}
                            href="/api/exit-preview"
                        >
                            Exit preview
                        </Link>
                    ) : null}
                </TranslationWrapper>
            </Provider>
        </>
    );
};

export default MyApp;
