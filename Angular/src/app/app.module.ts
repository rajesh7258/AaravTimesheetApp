import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { JwtModule } from "@auth0/angular-jwt";

import { AppComponent } from "./app.component";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";

import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgxSpinnerModule } from "ngx-spinner";
import { MatButtonModule } from "@angular/material";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
  MatDialogRef,
  MatDialogConfig,
  MAT_DIALOG_DATA
} from "@angular/material";

import { MatDialogModule } from "@angular/material/dialog";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ClipboardModule } from "ngx-clipboard";
import { ResetloginComponent } from "../app/resetlogin/resetlogin.component";
import { HeaderComponent } from "./layouts/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { LoginComponent } from "./login/login.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { environment } from "../environments/environment.prod";
import { AuthService } from "../app/providers/auth.service";
import { AuthGuard } from "../app/providers/auth.guard";
import { MatCardModule } from "@angular/material/card";
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

@NgModule({
  imports: [
    MatToolbarModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    NgxChartsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    ClipboardModule,
    MatCheckboxModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [environment.Nodeserver],
        blacklistedRoutes: [environment.Nodeserver + "/api/signin"]
      }
    }),
    MatCardModule,
    MatIconModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    ResetloginComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    ResetpasswordComponent
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
