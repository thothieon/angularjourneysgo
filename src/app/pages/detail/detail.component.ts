import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DataService, Tour, TourDate } from '../../services/data';

export interface CalendarCell {
  key: string;
  day: number;
  inMonth: boolean;
  tourDate: TourDate | null;
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class DetailComponent implements OnInit {
  tour = signal<Tour | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  selectedDate = signal<TourDate | null>(null);
  adultCount = signal(2);
  childCount = signal(0);
  expandedDays = signal<Set<number>>(new Set([1]));
  viewMode = signal<'list' | 'calendar'>('list');

  // 日曆：目前顯示的年月
  calYear = signal(new Date().getFullYear());
  calMonth = signal(new Date().getMonth()); // 0-based

  // 即時計算
  totalPrice = computed(() => {
    const d = this.selectedDate();
    if (!d) return 0;
    return d.price * this.adultCount() + Math.floor(d.price * 0.8) * this.childCount();
  });

  totalDeposit = computed(() => {
    const d = this.selectedDate();
    if (!d) return 0;
    return d.deposit * (this.adultCount() + this.childCount());
  });

  calendarTitle = computed(() => {
    const y = this.calYear();
    const m = this.calMonth() + 1;
    return `${y} 年 ${m} 月`;
  });

  calendarCells = computed<CalendarCell[]>(() => {
    const t = this.tour();
    const year = this.calYear();
    const month = this.calMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const cells: CalendarCell[] = [];

    // 上個月補位
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ key: `prev-${i}`, day: daysInPrev - i, inMonth: false, tourDate: null });
    }

    // 本月
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const tourDate = t?.dates.find(td => td.departure_date === dateStr) ?? null;
      cells.push({ key: `cur-${d}`, day: d, inMonth: true, tourDate });
    }

    // 補滿 6 列
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ key: `next-${d}`, day: d, inMonth: false, tourDate: null });
    }

    return cells;
  });

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.loadTour(parseInt(id, 10));
    });
  }

  loadTour(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.dataService.getCardById(id).subscribe({
      next: (data) => {
        this.tour.set(data);
        const first = data.dates?.find(d => d.status !== 'full');
        if (first) {
          this.selectedDate.set(first);
          // 日曆跳到第一個可用日期的月份
          const dt = new Date(first.departure_date);
          this.calYear.set(dt.getFullYear());
          this.calMonth.set(dt.getMonth());
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || '無法載入行程詳情');
        this.loading.set(false);
      }
    });
  }

  selectDate(date: TourDate) {
    if (date.status === 'full') return;
    this.selectedDate.set(date);
  }

  adjustCount(type: 'adult' | 'child', delta: number) {
    if (type === 'adult') {
      const next = this.adultCount() + delta;
      if (next >= 1 && next <= 20) this.adultCount.set(next);
    } else {
      const next = this.childCount() + delta;
      if (next >= 0 && next <= 20) this.childCount.set(next);
    }
  }

  toggleDay(day: number) {
    const s = new Set(this.expandedDays());
    s.has(day) ? s.delete(day) : s.add(day);
    this.expandedDays.set(s);
  }

  isDayExpanded(day: number): boolean {
    return this.expandedDays().has(day);
  }

  setViewMode(mode: 'list' | 'calendar') {
    this.viewMode.set(mode);
  }

  prevMonth() {
    let m = this.calMonth() - 1;
    let y = this.calYear();
    if (m < 0) { m = 11; y--; }
    this.calMonth.set(m);
    this.calYear.set(y);
  }

  nextMonth() {
    let m = this.calMonth() + 1;
    let y = this.calYear();
    if (m > 11) { m = 0; y++; }
    this.calMonth.set(m);
    this.calYear.set(y);
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      available: '可報名',
      almost_full: '即將成團',
      full: '滿團'
    };
    return map[status] ?? status;
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return `${String(d.getMonth() + 1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
  }

  formatWeekday(dateStr: string): string {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return `(${days[new Date(dateStr).getDay()]})`;
  }

  formatDateFull(dateStr: string): string {
    const d = new Date(dateStr);
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')} (${days[d.getDay()]})`;
  }

  goBack() {
    window.history.back();
  }
}
