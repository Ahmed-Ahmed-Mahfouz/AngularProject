import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from './../../services/product.service';
import { Iproduct } from '../../models/iproduct';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnDestroy {
  private subscription: Subscription[] = [];
  products: Iproduct[] = [];
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 1;
  pagesToShow = 5;
  pages: number[] = [];
  activePage: number = this.currentPage;

  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    const sub = this.productService
      .getProducts(this.currentPage, this.itemsPerPage)
      .subscribe((data: any) => {
        this.products = data.items;
        this.totalPages = Math.ceil(data.totalCount / this.itemsPerPage);
        this.updatePageList();
      });
    this.subscription.push(sub);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.activePage = this.currentPage;
      this.getProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.activePage = this.currentPage;
      this.getProducts();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.activePage = page;
    this.getProducts();
  }

  updatePageList(): void {
    const startPage = Math.max(
      1,
      this.currentPage - Math.floor(this.pagesToShow / 2)
    );
    const endPage = Math.min(this.totalPages, startPage + this.pagesToShow - 1);

    this.pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  deleteProduct(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe(() => {
          this.products = this.products.filter((product) => product.id !== id);
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
            confirmButtonColor: '#000000', // Set the color to black
          });
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
