package com.acs.app;

import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onStart() {
        super.onStart();

        // Verifica se a bridge e o webview existem antes de aplicar a config
        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebView webView = this.bridge.getWebView();
            WebSettings settings = webView.getSettings();

            // Permite carregar conteúdo HTTP dentro de uma página HTTPS (Mixed Content)
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
    }
}