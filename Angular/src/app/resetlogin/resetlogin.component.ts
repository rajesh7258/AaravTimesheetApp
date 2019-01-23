import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../providers/auth.service";
import { first } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import { Router, NavigationExtras } from "@angular/router";
@Component({
  selector: "app-resetlogin",
  templateUrl: "./resetlogin.component.html",
  styleUrls: ["./resetlogin.component.css"]
})
export class ResetloginComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  name: string;
  spinnerConfig: object = {
    bdColor: "#333",
    size: "large",
    color: "#fff"
  };
  public error: string;
  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private auth: AuthService,
    private router: Router
  ) {
    this.name = `ngx-spinner`;
  }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.resetForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }
    console.log(this.resetForm.value);
    this.spinner.show();
    this.auth
      .forgetpassword({ username: this.resetForm.controls.email.value })
      .pipe(first())
      .subscribe(
        result => {
          this.spinner.hide();
          alert("Temporary password send to email");
          this.router.navigate([""]);
        },
        err => {
          this.error = "Error in sending password";
          alert("Error in sending password please contact admin");
          this.spinner.hide(); // To hide the spinner
        }
      );
  }
}
