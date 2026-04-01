import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// ── 基本卡片 ──────────────────────────────────────────────
export interface Card {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  content: string;
  image: string;
  duration?: string;
}

// ── 列表頁卡片（含標籤、價格、近期日期）──────────────────
export interface DateSummary {
  departure_date: string;
  status: 'available' | 'almost_full' | 'full';
}

export interface CardListItem extends Card {
  tags: string[];
  min_price: number | null;
  next_dates: DateSummary[];
}

// ── 列表回應（含分頁）────────────────────────────────────
export interface CardListResponse {
  items: CardListItem[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ── 出發日期 ──────────────────────────────────────────────
export interface TourDate {
  id: number;
  departure_date: string;
  price: number;
  deposit: number;
  status: 'available' | 'almost_full' | 'full';
}

// ── 逐日行程 ──────────────────────────────────────────────
export interface ItineraryDay {
  id: number;
  day_number: number;
  title: string;
  description: string;
  image: string;
  meals: string[];
  hotel: string;
}

// ── 完整行程詳情 ──────────────────────────────────────────
export interface Tour extends CardListItem {
  highlights: string[];
  dates: TourDate[];
  itinerary: ItineraryDay[];
}

// ── 篩選參數 ──────────────────────────────────────────────
export interface TourFilter {
  category?: string;
  keyword?: string;
  days?: string;        // "1-5" | "6-9" | "10+"
  date_start?: string;
  date_end?: string;
  min_price?: number;
  max_price?: number;
  has_quota?: boolean;
  sort?: string;        // "latest" | "price_asc" | "price_desc"
  page?: number;
  per_page?: number;
}

@Injectable({ providedIn: 'root' })
export class DataService {

  //private apiUrl = 'https://api.journeygo.com.tw/journeygo';
  private apiUrl =  'http://192.168.5.12:5001/journeygo'

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.message || 'Server error'));
  }

  /** 列表頁：支援所有篩選/排序/分頁 */
  getTours(filter: TourFilter = {}): Observable<CardListResponse> {
    let params = new HttpParams();
    if (filter.category)   params = params.set('category',   filter.category);
    if (filter.keyword)    params = params.set('keyword',    filter.keyword);
    if (filter.days)       params = params.set('days',       filter.days);
    if (filter.date_start) params = params.set('date_start', filter.date_start);
    if (filter.date_end)   params = params.set('date_end',   filter.date_end);
    if (filter.min_price != null) params = params.set('min_price', String(filter.min_price));
    if (filter.max_price != null) params = params.set('max_price', String(filter.max_price));
    if (filter.has_quota)  params = params.set('has_quota',  'true');
    if (filter.sort)       params = params.set('sort',       filter.sort);
    if (filter.page)       params = params.set('page',       String(filter.page));
    if (filter.per_page)   params = params.set('per_page',   String(filter.per_page));

    return this.http.get<CardListResponse>(`${this.apiUrl}/cards`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /** 向下相容：舊程式呼叫 getCards() */
  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/cards`).pipe(
      catchError(this.handleError)
    );
  }

  /** 向下相容：舊程式呼叫 getCardsByCategory() */
  getCardsByCategory(category: string): Observable<Card[]> {
    const params = new HttpParams().set('category', category);
    return this.http.get<Card[]>(`${this.apiUrl}/cards`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`).pipe(
      catchError(this.handleError)
    );
  }

  getCardById(id: number): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl}/cards/${id}`).pipe(
      catchError((err: HttpErrorResponse) => throwError(() => err))
    );
  }
}
