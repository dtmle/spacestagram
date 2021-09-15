import React from "react";
import App from "next/app";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/dist/styles.css";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";

export default class WrappedApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const queryClient = new QueryClient();

    return (
      <QueryClientProvider client={queryClient}>
        <AppProvider i18n={enTranslations}>
          <Component {...pageProps} />
        </AppProvider>
      </QueryClientProvider>
    );
  }
}
