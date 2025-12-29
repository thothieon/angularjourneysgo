import { Component, OnInit, ViewChild, signal } from '@angular/core';

import { DataService, Card } from '../../services/data';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { IonicModule } from '@ionic/angular';
import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatMenuModule,
    MatMenuTrigger,
    MatButtonModule,
    IonicModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  cards = signal<Card[]>([]);
  block02cards = signal<Card[]>([]);
  block03cards = signal<Card[]>([]);
  block04cards = signal<Card[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // 每個區塊最多顯示的卡片數量
  private readonly MAX_CARDS_PER_BLOCK = 6;

  // 固定篩選分類
  private readonly FIXED_CATEGORY_JAPAN = '日本';
  private readonly FIXED_CATEGORY_USA = '美國';
  private readonly FIXED_CATEGORY_TAIWAN = '台灣';
  private readonly FIXED_CATEGORY_CHINA = '中國';

  constructor(private dataService: DataService) {
    console.log('🏠 HomeComponent initialized');
  }

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  hello() { console.log('Ionic + Angular 20!'); }

  someMethod() {
    this.trigger.openMenu();
  }

  ngOnInit() {
    console.log('🔄 ngOnInit called');
    this.testConnection();
    this.loadblock01Cards();
    this.loadblock02Cards();
    this.loadblock03Cards();
    this.loadblock04Cards();
  }

  testConnection() {
    console.log('🧪 Testing backend connection...');
    this.dataService.testConnection().subscribe({
      next: (data) => {
        console.log('✅ Connection test successful:', data);
      },
      error: (error) => {
        console.error('❌ Connection test failed:', error);
        this.error.set('Backend connection failed: ' + error.message);
      }
    });
  }

  // 載入第一區塊卡片
  loadblock01Cards() {
    console.log('📥 Loading block 01 cards...');
    this.loading.set(true);
    this.error.set(null);

    this.dataService.getCardsByCategory(this.FIXED_CATEGORY_JAPAN).subscribe({
      next: (data) => {
        console.log('✅ Japan cards loaded successfully:', data);
        this.cards.set(data.slice(0, this.MAX_CARDS_PER_BLOCK));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('❌ Failed to load Japan cards:', error);
        this.error.set(error.message);
        this.loading.set(false);

        // 使用假資料作為後備
        const mockData: Card[] = [
          {
            id: 1,
            title: '東京五日遊',
            subtitle: '日本旅遊',
            content: 'Backend not available, showing mock data.',
            image: 'https://ionicframework.com/docs/img/demos/card-media.png',
            category: '日本線'
          }
        ];
        console.log('🔧 Using mock data:', mockData);
        this.cards.set(mockData);
      }
    });
  }

  // 載入第二區塊卡片
  loadblock02Cards() {
    console.log('📥 Loading block 02 cards...');
    this.loading.set(true);
    this.error.set(null);

    this.dataService.getCardsByCategory(this.FIXED_CATEGORY_USA).subscribe({
      next: (data) => {
        console.log('✅ USA cards loaded successfully:', data);
        this.block02cards.set(data.slice(0, this.MAX_CARDS_PER_BLOCK));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('❌ Failed to load USA cards:', error);
        this.error.set(error.message);
        this.loading.set(false);

        // 使用假資料作為後備
        const mockData: Card[] = [
          {
            id: 101, // 改個不同的 ID
            title: '紐約五日遊',
            subtitle: '美國旅遊',
            content: 'Backend not available, showing mock data.',
            image: 'https://ionicframework.com/docs/img/demos/card-media.png',
            category: '美國線'
          }
        ];
        console.log('🔧 Using mock data for USA:', mockData);
        this.block02cards.set(mockData);
      }
    });
  }

  // 載入第三區塊卡片
  loadblock03Cards() {
    console.log('📥 Loading block 03 cards...');
    this.loading.set(true);
    this.error.set(null);

    this.dataService.getCardsByCategory(this.FIXED_CATEGORY_TAIWAN).subscribe({
      next: (data) => {
        console.log('✅ Taiwan cards loaded successfully:', data);
        this.block03cards.set(data.slice(0, this.MAX_CARDS_PER_BLOCK));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('❌ Failed to load Taiwan cards:', error);
        this.error.set(error.message);
        this.loading.set(false);

        // 使用假資料作為後備
        const mockData: Card[] = [
          {
            id: 101, // 改個不同的 ID
            title: '台灣五日遊',
            subtitle: '台灣旅遊',
            content: 'Backend not available, showing mock data.',
            image: 'https://ionicframework.com/docs/img/demos/card-media.png',
            category: '台灣線'
          }
        ];
        console.log('🔧 Using mock data for Taiwan:', mockData);
        this.block03cards.set(mockData);
      }
    });
  }

  // 載入第四區塊卡片
  loadblock04Cards() {
    console.log('📥 Loading block 04 cards...');
    this.loading.set(true);
    this.error.set(null);

    this.dataService.getCardsByCategory(this.FIXED_CATEGORY_CHINA).subscribe({
      next: (data) => {
        console.log('✅ China cards loaded successfully:', data);
        this.block04cards.set(data.slice(0, this.MAX_CARDS_PER_BLOCK));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('❌ Failed to load China cards:', error);
        this.error.set(error.message);
        this.loading.set(false);

        // 使用假資料作為後備
        const mockData: Card[] = [
          {
            id: 101, // 改個不同的 ID
            title: 'China五日遊',
            subtitle: '中國旅遊',
            content: 'Backend not available, showing mock data.',
            image: 'https://ionicframework.com/docs/img/demos/card-media.png',
            category: '中國線'
          }
        ];
        console.log('🔧 Using mock data for China:', mockData);
        this.block04cards.set(mockData);
      }
    });
  }

  loadCategories() {
    console.log('📥 Loading categories...');
    this.dataService.getCategories().subscribe({
      next: (data) => {
        console.log('✅ Categories loaded:', data);
        //this.categories.set(['全部', ...data]);
      },
      error: (error) => {
        console.error('❌ Failed to load categories:', error);
        // 使用預設分類
        //this.categories.set(['全部', '中國線', '日本線', '美國線']);
      }
    });
  }

  loadCards() {
    console.log('📥 Loading cards...');
    this.loading.set(true);
    this.error.set(null);

    this.dataService.getCards().subscribe({
      next: (data) => {
        console.log('✅ Cards loaded successfully:', data);
        this.cards.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('❌ Failed to load cards:', error);
        this.error.set(error.message);
        this.loading.set(false);

        // 使用假資料作為後備
        const mockData: Card[] = [
          {
            id: 1,
            title: 'Mock Card 1',
            subtitle: 'This is mock data',
            category: '日本',
            content: 'Backend not available, showing mock data.',
            image: 'https://ionicframework.com/docs/img/demos/card-media.png'
          },
          {
            id: 2,
            title: 'Mock Card 1',
            subtitle: 'This is mock data',
            category: '日本',
            content: 'Backend not available, showing mock data.',
            image: 'https://ionicframework.com/docs/img/demos/card-media.png'
          },
          {
            id: 2,
            title: 'Mock Card 1',
            subtitle: 'This is mock data',
            category: '台灣',
            content: 'Backend not available, showing mock data.',
            image: 'https://ionicframework.com/docs/img/demos/card-media.png'
          }
        ];
        console.log('🔧 Using mock data:', mockData);
        this.cards.set(mockData);
      }
    });
  }

  loadCardsByCategory(category: string) {
    console.log('📥 Loading cards by category:', category);
    //this.selectedCategory.set(category);
    this.loading.set(true);
    this.error.set(null);

    if (category === '全部') {
      this.loadCards();
      return;
    }

    this.dataService.getCardsByCategory(category).subscribe({
      next: (data) => {
        console.log(`✅ Cards loaded for category "${category}":`, data);
        this.cards.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(`❌ Failed to load cards for category "${category}":`, error);
        this.error.set(error.message);
        this.loading.set(false);
        this.cards.set([]);
      }
    });
  }

  reloadCards() {
    console.log('🔄 Manually reloading cards...');
    this.loadblock01Cards();
    this.loadblock02Cards();
    this.loadblock03Cards();
    this.loadblock04Cards();
  }

}
