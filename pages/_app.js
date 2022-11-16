import '../styles/globals.css'
import Head from "next/head"

function MyApp({ Component, pageProps }) {
    return <>
        <Head>
            <title key="title">備品管理系統</title>
            <meta name="description" content="一個拿來管理備品的系統"/>
        </Head>
        <Component {...pageProps} />
    </>
}

export default MyApp
