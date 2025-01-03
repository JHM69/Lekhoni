// eslint-disable-next-line @next/next/no-document-import-in-page
import { Head, Html, Main, NextScript } from "next/document";

 

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
       
        <body
          style={{
            fontFamily: 'lekonifont',
          }}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
