import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Iproduct } from '../../../models/iproduct';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  id: any;
  product?: Iproduct;
  sub: any;
  constructor(
    public activatedRoute: ActivatedRoute,
    public productServices: ProductService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.sub = this.productServices.getProduct(this.id).subscribe((data) => {
      this.product = data;
      console.log(this.product);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  backToProducts() {
    this.router.navigate(['/products']);
  }
}
