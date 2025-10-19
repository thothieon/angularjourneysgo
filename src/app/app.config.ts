import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, RouteReuseStrategy } from '@angular/router';

import { routes } from './app.routes';

// ★ Ionic（Standalone）
import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular/standalone';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // 讓 Ionic 幫忙做頁面快取與回退行為
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // 啟用 Ionic，必要！可選擇性傳入設定（例如 mode: 'md' | 'ios'）
    provideIonicAngular({
      // animated: true,
      // mode: 'md'
    }),
  ]
};
