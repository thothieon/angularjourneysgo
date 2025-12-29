import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

export interface Card {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  content: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  
  private apiUrl = 'https://api.journeygo.com.tw/journeygo'; // 後端 API 位址

  constructor(private http: HttpClient) {
    console.log('🔧 DataService initialized, API URL:', this.apiUrl);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('❌ HTTP Error Details:', error);
    console.error('  - Status:', error.status);
    console.error('  - Status Text:', error.statusText);
    console.error('  - Error:', error.error);
    console.error('  - Message:', error.message);
    console.error('  - URL:', error.url);
    if (error.status === 0) {
      console.error('⚠️ Network error - Backend may not be running or CORS issue');
    }
    return throwError(() => new Error(error.message || 'Server error'));
  }

  // 取得所有卡片
  getCards(): Observable<Card[]> {
    const url = `${this.apiUrl}/cards`;
    console.log('📡 Fetching cards from:', url);
    console.log('⏰ Request sent at:', new Date().toISOString());
    
    return this.http.get<Card[]>(url).pipe(
      tap(data => {
        console.log('✅ Cards received:', data);
        console.log('📊 Total cards:', data.length);
        console.log('🕐 Response received at:', new Date().toISOString());
        console.table(data);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ HTTP Error Details:');
        console.error('  - Status:', error.status);
        console.error('  - Status Text:', error.statusText);
        console.error('  - Error:', error.error);
        console.error('  - Message:', error.message);
        console.error('  - URL:', error.url);
        console.error('  - Full Error Object:', error);
        
        if (error.status === 0) {
          console.error('⚠️ Network error - Backend may not be running or CORS issue');
        }
        
        return throwError(() => new Error(error.message || 'Server error'));
      })
    );
  }

  // 依照 category 取得卡片
  getCardsByCategory(category: string): Observable<Card[]> {
    const url = `${this.apiUrl}/cards`;
    const params = new HttpParams().set('category', category);
    
    console.log('📡 Fetching cards by category:', category);
    console.log('📡 URL:', url);
    console.log('📡 Params:', params.toString());
    
    return this.http.get<Card[]>(url, { params }).pipe(
      tap(data => {
        console.log(`✅ Cards received for category "${category}":`, data);
        console.log('📊 Total cards:', data.length);
        console.table(data);
      }),
      catchError(this.handleError)
    );
  }

  // 取得所有可用的 categories
  getCategories(): Observable<string[]> {
    const url = `${this.apiUrl}/categories`;
    console.log('📡 Fetching categories from:', url);
    
    return this.http.get<string[]>(url).pipe(
      tap(data => {
        console.log('✅ Categories received:', data);
      }),
      catchError(this.handleError)
    );
  }

  getCardById(id: number): Observable<Card> {
    console.log('📡 Fetching card ID:', id);
    
    return this.http.get<Card>(`${this.apiUrl}/cards/${id}`).pipe(
      tap(data => {
        console.log('✅ Card received:', data);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error fetching card:', error);
        return throwError(() => error);
      })
    );
  }

  testConnection(): Observable<any> {
    const url = `${this.apiUrl}/health`;
    console.log('🧪 Testing API connection:', url);
    
    return this.http.get(url).pipe(
      tap(data => {
        console.log('✅ Health check SUCCESS:', data);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Health check FAILED:');
        console.error('  - Status:', error.status);
        console.error('  - Message:', error.message);
        console.error('  - Error:', error.error);
        
        if (error.status === 0) {
          console.error('⚠️ Cannot reach backend at:', this.apiUrl);
          console.error('⚠️ Make sure Python Flask is running on port 5000');
        }
        
        return throwError(() => error);
      })
    );
  }

  createCard(card: Partial<Card>): Observable<Card> {
    return this.http.post<Card>(`${this.apiUrl}/cards`, card);
  }

  updateCard(id: number, card: Partial<Card>): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/cards/${id}`, card);
  }

  deleteCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cards/${id}`);
  }
}
