import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Iproduct } from '../models/iproduct';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseURL: string = 'http://localhost:8454/api/product';

  constructor(private http: HttpClient) {}

  getProducts(pageNumber: number = 1, pageSize: number = 4): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(this.baseURL, { params });
  }

  getProductsByCategory(
    categoryId: number,
    pageNumber: number = 1,
    pageSize: number = 4
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.baseURL}/getbycategory/${categoryId}`, {
      params,
    });
  }

  getProduct(id: number) {
    return this.http.get<Iproduct>(this.baseURL + '/' + id);
  }

  addProduct(product: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(this.baseURL, product, { headers });
  }

  updateProduct(id: number, product: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.put(this.baseURL + '/' + id, product, { headers });
  }

  deleteProduct(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.delete(`${this.baseURL}/${id}`, { headers });
  }
}
