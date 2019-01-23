import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { MatButtonModule, MatToolbarModule } from "@angular/material";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { NgxSpinnerModule } from "ngx-spinner";
import { ClipboardModule } from "ngx-clipboard";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ResetloginComponent } from "../app/resetlogin/resetlogin.component";
import { ResetpasswordComponent } from "../app/resetpassword/resetpassword.component";
import { AuthGuard } from "../app/providers/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  { path: "resetlogin", component: ResetloginComponent },
  { path: "resetpassword", component: ResetpasswordComponent },
  {
    path: "createaccount",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        loadChildren:
          "./layouts/admin-layout/admin-layout.module#AdminLayoutModule"
      }
    ]
  },
  {
    path: "**",
    redirectTo: "createaccount"
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    NgxSpinnerModule,
    ClipboardModule,
    MatSnackBarModule
  ],
  providers: [],
  declarations: [],
  exports: []
})
export class AppRoutingModule {}
