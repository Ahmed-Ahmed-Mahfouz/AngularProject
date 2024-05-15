import { ProductService } from './../../../services/product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Iproduct } from '../../../models/iproduct';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  id: any;
  productForm?: FormGroup;
  selectedFile: File | undefined;
  categories: any[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      id: 0,
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      description: ['', Validators.required],
      brand: ['', Validators.required],
      stock: [null, [Validators.required, Validators.min(0)]],
      modelYear: [null, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      categoryName: [''],
    });
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.categories = data;
      });
    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe((params) => {
      this.id = +params['id'];
      if (this.id != 0) {
        this.productService.getProduct(this.id).subscribe((product) => {
          this.productForm?.setValue(product);
        });
      }
    });
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    this.uploadFile();
  }
  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('upload_preset', 'coss578i');

      fetch('https://api.cloudinary.com/v1_1/dgcok5dgw/image/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.secure_url) {
            this.productForm?.patchValue({ imageUrl: data.secure_url });
          }
        })
        .catch((error) => {
          console.error('Error uploading file to Cloudinary:', error);
        });
    }
  }
  productHandler() {
    if (this.productForm?.valid) {
      const product: Iproduct = this.productForm.value;
      product.categoryId = this.productForm.get('categoryId')?.value;
      product.categoryName = this.categories.find(
        (c) => c.id == product.categoryId
      )?.name;
      if (this.id == 0) {
        this.productService.addProduct(product).subscribe({
          next: () => this.router.navigate(['/dashboard']),
        });
      } else {
        this.productService.updateProduct(this.id, product).subscribe({
          next: () => this.router.navigate(['/dashboard']),
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
