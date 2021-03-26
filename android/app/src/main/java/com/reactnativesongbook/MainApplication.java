package com.reactnativesongbook;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnativecommunity.slider.ReactSliderPackage;
import com.rnfs.RNFSPackage;
import com.horcrux.svg.SvgPackage;
import dog.craftz.sqlite_2.RNSqlite2Package;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import android.webkit.WebView; // for webview debugging

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

    // for webview debugging
    @Override
    public void onCreate() {
      super.onCreate();
      WebView.setWebContentsDebuggingEnabled(true);
    }
    
    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
            new SvgPackage(),
            new RNSqlite2Package(),
            new ReactNativeDocumentPicker(),
            new RNFSPackage(),
            new ReactSliderPackage(),
            new RNCWebViewPackage()
            // eg. new VectorIconsPackage()
        );
    }
  
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}