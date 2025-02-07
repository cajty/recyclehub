import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { Store } from "@ngrx/store"
import  { Observable, Subscription } from "rxjs"
import { AsyncPipe, NgIf, CommonModule } from "@angular/common"
import type { User } from "../../../../models/user.model"
import * as UserActions from "../../../../store/user/user.actions"
import * as UserSelectors from "../../../../store/user/user.selectors"
import  { ActivatedRoute } from "@angular/router"
import {  FormBuilder,  FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import  { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-profile-view",
  standalone: true,
  imports: [NgIf, AsyncPipe, CommonModule, ReactiveFormsModule],
  templateUrl: "./profile-view.component.html",
  styleUrls: ["./profile-view.component.css"],
})
export class ProfileViewComponent implements OnInit, OnDestroy {
  user$: Observable<User | null>
  loading$: Observable<boolean>
  error$: Observable<string | null>
 userSubscription: Subscription | null = null
profileForm!: FormGroup
isEditing: boolean = false

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.user$ = this.store.select(UserSelectors.selectUser)
    this.loading$ = this.store.select(UserSelectors.selectUserLoading)
    this.error$ = this.store.select(UserSelectors.selectUserError)
    this.profileForm = this.fb.group({
      id: [""],
      fullName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.required],
      address: ["", Validators.required],
      birthDate: ["", Validators.required],
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const email = localStorage.getItem("user-email")
      if (email) {
        this.store.dispatch(UserActions.loadUserByEmail({ email }))
      }
    })

    this.userSubscription = this.user$.subscribe((user) => {
      if (user) {
        this.profileForm.patchValue({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phoneNumber,
          address: user.address,
          birthDate: user.dateOfBirth,
        })
      }
    })
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe()
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing
    if (!this.isEditing) {
      this.profileForm.patchValue(this.profileForm.value)
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const userId = this.profileForm.get("id")?.value
      const userData: Partial<User> = this.profileForm.value
      this.store.dispatch(UserActions.updateUser({ id: userId, user: userData }))
      this.isEditing = false
      this.snackBar.open("Profile updated successfully", "Close", { duration: 3000 })
    }
  }

  deleteAccount(): void {
    const userId = this.profileForm.get("id")?.value
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      this.store.dispatch(UserActions.deleteUser({ id: userId }))
      this.snackBar.open("Account deleted successfully", "Close", { duration: 3000 })
    }
  }

  convertPoints(pointsToRedeem: number): void {
    const userId = this.profileForm.get("id")?.value
    if (pointsToRedeem === 100 || pointsToRedeem === 200 || pointsToRedeem === 500) {
      this.store.dispatch(
        UserActions.updateUserPoints({
          id: userId,
          points: pointsToRedeem,
        }),
      )
      this.snackBar.open(`${pointsToRedeem} points converted successfully`, "Close", { duration: 3000 })
    }
  }
}

