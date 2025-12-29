import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// 加入 Ionic 初始化
import { defineCustomElements } from '@ionic/core/loader';

// 初始化 Ionic Web Components（包含 ionicons）
defineCustomElements(window);

bootstrapApplication(
  App, 
  { 
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideNoopAnimations(),
      ...(appConfig.providers || [])
    ]
  }
).catch((err) => console.error(err));
