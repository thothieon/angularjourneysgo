import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { HomemenuComponent } from './pages/homemenu/homemenu.component';
import { MenuComponent } from './pages/menu/menu.component';

export const routes: Routes = [
  { path: 'menu', component: MenuComponent },
  { path: 'homemenu', component: HomemenuComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  //{ path: '', redirectTo: 'home', pathMatch: 'full' },
  // 可選：未知路徑也丟回首頁
  //{ path: '**', redirectTo: 'home' },
];
