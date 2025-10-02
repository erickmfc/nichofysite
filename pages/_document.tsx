import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="NichoFy - Plataforma de criação de conteúdo com IA" />
        <meta name="keywords" content="IA, conteúdo, marketing, copywriting, nichos" />
        <meta name="author" content="NichoFy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
