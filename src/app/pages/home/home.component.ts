import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { DataService, CardListItem } from '../../services/data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  // ── 行程資料 ─────────────────────────────────────────────
  featuredCards   = signal<CardListItem[]>([]);
  japanCards      = signal<CardListItem[]>([]);
  usaCards        = signal<CardListItem[]>([]);
  taiwanCards     = signal<CardListItem[]>([]);
  malaysiaCards   = signal<CardListItem[]>([]);
  bruneiCards     = signal<CardListItem[]>([]);
  sabahCards      = signal<CardListItem[]>([]);

  // ── 導覽列 ───────────────────────────────────────────────
  navOpen      = false;
  dropdownOpen = '';

  // ── Hero Slider ──────────────────────────────────────────
  currentSlide = 0;
  private sliderTimer: any;

  slides = [
    {
      title: '尋找幸福的極光',
      subtitle: '在世界的盡頭，遇見一生必看的極地奇蹟',
      btn: '了解詳情',
      tag: '極光',
      img: 'assets/slides/slide-aurora.jpg',
    },
    {
      title: '雪の大谷',
      subtitle: '立山黑部・阿爾卑斯山脈之路',
      btn: '查看行程',
      tag: '日本',
      img: 'assets/slides/slide-japan.jpg',
    },
    {
      title: '北海道四季都好玩',
      subtitle: '精選北海道頂級行程，感受四季不同風情',
      btn: '立即探索',
      tag: '北海道',
      img: 'assets/slides/slide-hokkaido.jpg',
    },
  ];

  // ── 搜尋篩選 ─────────────────────────────────────────────
  searchDest      = '';
  searchDateStart = '';
  searchDateEnd   = '';
  searchDays      = '';
  searchKeyword   = '';

  readonly destinations = ['中東','新馬','日本','歐洲','泰國','越南','韓國','美國','台灣','馬來西亞','汶萊','沙巴'];
  readonly daysOptions  = [
    { v: '',    l: '不限天數' },
    { v: '1-5', l: '1–5 天'  },
    { v: '6-9', l: '6–9 天'  },
    { v: '10+', l: '10 天以上'},
  ];

  // ── 精選主題 ─────────────────────────────────────────────
  themes = [
    { label: '熱門行程',   tag: '熱門',   icon: '🔥' },
    { label: '極光之旅',   tag: '極光',   icon: '🌌' },
    { label: '日本精選',   tag: '日本',   icon: '🗾' },
    { label: '歐洲漫遊',   tag: '歐洲',   icon: '🏰' },
    { label: '蜜月旅行',   tag: '蜜月',   icon: '💑' },
    { label: '親子行程',   tag: '親子',   icon: '👨‍👩‍👧' },
    { label: '海島度假',   tag: '海島',   icon: '🏖️' },
    { label: '溫泉之旅',   tag: '溫泉',   icon: '♨️' },
    { label: '超值促銷',   tag: '促銷',   icon: '🏷️' },
    { label: '早鳥優惠',   tag: '早鳥',   icon: '🐦' },
  ];

  // ── 旅遊小幫手 ────────────────────────────────────────────
  tools = [
    { icon: '🌤️', title: '天氣查詢',     subtitle: '即時掌握當地氣候', color: '#eff6ff' },
    { icon: '💱', title: '匯率換算',     subtitle: '最新即時匯率',     color: '#f0fdf4' },
    { icon: '🔌', title: '旅遊插頭查詢', subtitle: '各國電壓插座',     color: '#fefce8' },
    { icon: '✈️', title: '客製包團',     subtitle: '企業/家族旅遊需求', color: '#fdf4ff' },
  ];

  // ── Tool Modal ────────────────────────────────────────────
  modalOpen    = false;
  modalTitle   = '';
  modalContent = '';

  private readonly MAX = 6;

  constructor(
    private dataService: DataService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {}

  slideBg(img: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${img})`);
  }

  ngOnInit() {
    this.loadCards();
    this.startSlider();
  }

  ngOnDestroy() { this.stopSlider(); }

  // ── 資料載入 ─────────────────────────────────────────────
  private loadCards() {
    // 熱門行程（全部取前6筆）
    this.dataService.getTours({ sort: 'latest', per_page: this.MAX }).subscribe({
      next: r => this.featuredCards.set(r.items ?? []),
      error: () => this.featuredCards.set([]),
    });
    this.dataService.getTours({ category: '日本', per_page: this.MAX }).subscribe({
      next: r => this.japanCards.set(r.items ?? []),
      error: () => this.japanCards.set([]),
    });
    this.dataService.getTours({ category: '美國', per_page: this.MAX }).subscribe({
      next: r => this.usaCards.set(r.items ?? []),
      error: () => this.usaCards.set([]),
    });
    this.dataService.getTours({ category: '台灣', per_page: this.MAX }).subscribe({
      next: r => this.taiwanCards.set(r.items ?? []),
      error: () => this.taiwanCards.set([]),
    });
    this.dataService.getTours({ category: '馬來西亞', per_page: this.MAX }).subscribe({
      next: r => this.malaysiaCards.set(r.items ?? []),
      error: () => this.malaysiaCards.set([]),
    });
    this.dataService.getTours({ category: '汶萊', per_page: this.MAX }).subscribe({
      next: r => this.bruneiCards.set(r.items ?? []),
      error: () => this.bruneiCards.set([]),
    });
    this.dataService.getTours({ category: '沙巴', per_page: this.MAX }).subscribe({
      next: r => this.sabahCards.set(r.items ?? []),
      error: () => this.sabahCards.set([]),
    });
  }

  // ── Slider ────────────────────────────────────────────────
  startSlider() { this.sliderTimer = setInterval(() => this.nextSlide(), 5000); }
  stopSlider()  { clearInterval(this.sliderTimer); }

  goToSlide(i: number) { this.currentSlide = i; this.stopSlider(); this.startSlider(); }
  nextSlide()  { this.currentSlide = (this.currentSlide + 1) % this.slides.length; }
  prevSlide()  {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.stopSlider(); this.startSlider();
  }

  // ── 搜尋 ──────────────────────────────────────────────────
  searchTours() {
    const cat = this.searchDest || 'all';
    this.router.navigate(['/category', cat], {
      queryParams: {
        keyword:    this.searchKeyword    || null,
        days:       this.searchDays       || null,
        date_start: this.searchDateStart  || null,
        date_end:   this.searchDateEnd    || null,
      },
    });
  }

  goToTheme(tag: string) {
    this.router.navigate(['/category', 'all'], { queryParams: { keyword: tag } });
  }

  // ── Navbar ────────────────────────────────────────────────
  toggleNav()              { this.navOpen = !this.navOpen; }
  openDropdown(n: string)  { this.dropdownOpen = n; }
  closeDropdown()          { this.dropdownOpen = ''; }
  closeNav()               { this.navOpen = false; this.dropdownOpen = ''; }

  // ── Tool Modal ────────────────────────────────────────────
  openModal(tool: { title: string }) {
    this.modalTitle   = tool.title;
    this.modalContent = tool.title;
    this.modalOpen    = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modalOpen = false;
    document.body.style.overflow = '';
  }

  // ── 日期格式 ──────────────────────────────────────────────
  formatDate(s: string): string {
    const d = new Date(s);
    return `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
  }
}
