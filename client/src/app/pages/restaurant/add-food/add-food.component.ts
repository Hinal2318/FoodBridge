import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FoodService } from '../../../services/food.service';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { LucideAngularModule, PlusCircle, ArrowLeft, Loader2, Utensils } from 'lucide-angular';

@Component({
  selector: 'app-add-food',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent, LucideAngularModule],
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.scss']
})
export class AddFoodComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private foodService = inject(FoodService);
  private router = inject(Router);

  readonly PlusCircle = PlusCircle;
  readonly ArrowLeft = ArrowLeft;
  readonly Loader2 = Loader2;
  readonly Utensils = Utensils;

  loading = false;
  successMsg = '';
  errorMsg = '';

  // Min datetime = now
  get minDateTime(): string {
    return new Date().toISOString().slice(0, 16);
  }

  get user() { return this.auth.currentUser(); }

  form = this.fb.group({
    name:        ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    quantity:    [null as number | null, [Validators.required, Validators.min(1)]],
    unit:        ['kg', Validators.required],
    expiryTime:  ['', Validators.required],
    location:    ['', Validators.required],
    description: ['', Validators.maxLength(200)],
  });

  ngOnInit(): void {
    // Pre-fill location from user profile
    const loc = this.user?.location ?? '';
    this.form.patchValue({ location: loc });
  }

  // Getters
  get name()        { return this.form.get('name')!; }
  get quantity()    { return this.form.get('quantity')!; }
  get unit()        { return this.form.get('unit')!; }
  get expiryTime()  { return this.form.get('expiryTime')!; }
  get location()    { return this.form.get('location')!; }
  get description() { return this.form.get('description')!; }

  get descLength(): number { return this.description.value?.length ?? 0; }

  isInvalid(ctrl: AbstractControl): boolean {
    return ctrl.invalid && ctrl.touched;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const { name, quantity, unit, expiryTime, location, description } = this.form.value;

    this.foodService.addFood({
      name: name!,
      quantity: quantity!,
      unit: unit as any,
      expiryTime: new Date(expiryTime!).toISOString(),
      location: location!,
      description: description || undefined,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = '🎉 Food listing created successfully!';
        setTimeout(() => this.router.navigate(['/restaurant/food-list']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Failed to add food. Please try again.';
      }
    });
  }
}
