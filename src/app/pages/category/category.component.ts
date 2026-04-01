import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, CardListItem, CardListResponse, TourFilter } from '../../services/data';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {

  // ── 資料 ────────────────────────────────────────────────
  cards    = signal<CardListItem[]>([]);
  total    = signal(0);
  totalPages = signal(1);
  loading  = signal(false);
  error    = signal<string | null>(null);

  // ── 篩選狀態 ────────────────────────────────────────────
  filterCategory  = signal('');
  filterKeyword   = signal('');
  filterDays      = signal('');
  filterDateStart = signal('');
  filterDateEnd   = signal('');
  filterMinPrice  = signal<number | null>(null);
  filterMaxPrice  = signal<number | null>(null);
  filterHasQuota  = signal(false);
  sortBy          = signal('latest');
  currentPage     = signal(1);
  readonly perPage = 12;

  // 手機版篩選抽屜
  drawerOpen = signal(false);

  // 分頁陣列
  pages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  // 目的地選項
  readonly destinations = ['日本', '歐洲', '美國', '韓國', '馬來西亞', '沙巴', '汶萊', '東南亞', '台灣', '中東'];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(([params, query]) => {
      const cat = params.get('category') || '';
      this.filterCategory.set(cat === 'all' ? '' : cat);
      if (query.get('keyword'))    this.filterKeyword.set(query.get('keyword')!);
      if (query.get('days'))       this.filterDays.set(query.get('days')!);
      if (query.get('date_start')) this.filterDateStart.set(query.get('date_start')!);
      if (query.get('date_end'))   this.filterDateEnd.set(query.get('date_end')!);
      this.currentPage.set(1);
      this.loadTours();
    });
  }

  loadTours() {
    this.loading.set(true);
    this.error.set(null);

    const filter: TourFilter = {
      category:   this.filterCategory() || undefined,
      keyword:    this.filterKeyword()  || undefined,
      days:       this.filterDays()     || undefined,
      date_start: this.filterDateStart()|| undefined,
      date_end:   this.filterDateEnd()  || undefined,
      min_price:  this.filterMinPrice() ?? undefined,
      max_price:  this.filterMaxPrice() ?? undefined,
      has_quota:  this.filterHasQuota() || undefined,
      sort:       this.sortBy(),
      page:       this.currentPage(),
      per_page:   this.perPage,
    };

    this.dataService.getTours(filter).subscribe({
      next: (res: CardListResponse) => {
        // 新 API 回傳 {items, total, ...}
        this.cards.set(res.items ?? (res as any));
        this.total.set(res.total ?? 0);
        this.totalPages.set(res.total_pages ?? 1);
        this.loading.set(false);
        this.drawerOpen.set(false);
      },
      error: (err) => {
        //this.error.set(err.message || '載入失敗');
        this.error.set('載入失敗');
        console.log(err.message || '載入失敗');
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  applyFilter() {
    this.currentPage.set(1);
    this.loadTours();
  }

  clearFilter() {
    this.filterKeyword.set('');
    this.filterDays.set('');
    this.filterDateStart.set('');
    this.filterDateEnd.set('');
    this.filterMinPrice.set(null);
    this.filterMaxPrice.set(null);
    this.filterHasQuota.set(false);
    this.sortBy.set('latest');
    this.currentPage.set(1);
    this.loadTours();
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages()) return;
    this.currentPage.set(p);
    this.loadTours();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setCategory(cat: string) {
    this.filterCategory.set(cat);
    this.applyFilter();
  }

  onSortChange() {
    this.currentPage.set(1);
    this.loadTours();
  }

  toggleDrawer() { this.drawerOpen.set(!this.drawerOpen()); }
  closeDrawer()  { this.drawerOpen.set(false); }

  statusLabel(status: string): string {
    return { available: '可報名', almost_full: '即將成團', full: '滿團' }[status] ?? status;
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return `${String(d.getMonth() + 1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
  }

  goBack() { window.history.back(); }
}
