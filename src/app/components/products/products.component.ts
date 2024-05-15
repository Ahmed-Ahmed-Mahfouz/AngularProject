import { CategoryService } from './../../services/category.service';
import { RouterLink } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from './../../services/product.service';
import { Iproduct } from '../../models/iproduct';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  products: Iproduct[] = [];
  currentPage = 1;
  itemsPerPage = 4;
  totalPages = 1;
  pagesToShow = 5;
  pages: number[] = [];
  activePage: number = this.currentPage;
  categories: any[] = [];
  activeCategoryId: number | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}
  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
  }
  getProducts(): void {
    this.productService
      .getProducts(this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.products = data.items;
        this.totalPages = Math.ceil(data.totalCount / this.itemsPerPage);
        this.updatePageList(data.totalCount);
      });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.activePage = this.currentPage;
      this.activeCategoryId
        ? this.filterByCategory(this.activeCategoryId)
        : this.getProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.activePage = this.currentPage;
      this.activeCategoryId
        ? this.filterByCategory(this.activeCategoryId)
        : this.getProducts();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.activePage = page;
    this.activeCategoryId
      ? this.filterByCategory(this.activeCategoryId)
      : this.getProducts();
  }

  updatePageList(totalCount: number): void {
    const startPage = Math.max(
      1,
      this.currentPage - Math.floor(this.pagesToShow / 2)
    );
    const endPage = Math.min(this.totalPages, startPage + this.pagesToShow - 1);

    this.pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
    this.totalPages = Math.ceil(totalCount / this.itemsPerPage);
  }

  getCategories(): void {
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.categories = data;
      });
  }

  filterByCategory(categoryId: number): void {
    this.activeCategoryId = categoryId;
    this.currentPage = 1;
    this.productService
      .getProductsByCategory(categoryId, this.currentPage, this.itemsPerPage)
      .subscribe((data: any) => {
        this.products = data.items;
        const totalCount = data.totalCount;
        this.totalPages = Math.ceil(totalCount / this.itemsPerPage);
        this.updatePageList(totalCount);
      });
  }

  getAllProducts(): void {
    this.activeCategoryId = null;
    this.productService
      .getProducts(this.currentPage, this.itemsPerPage)
      .subscribe((data: any) => {
        this.products = data.items;
        this.totalPages = Math.ceil(data.totalCount / this.itemsPerPage);
        this.updatePageList(data.totalCount);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
