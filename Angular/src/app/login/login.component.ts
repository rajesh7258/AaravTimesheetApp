import { Component, OnInit, Input, HostListener } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { Router, NavigationExtras } from "@angular/router";
import { DataService } from "../providers/data/data.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "../providers/auth.service";
import { first } from "rxjs/operators";
import { Alert } from "selenium-webdriver";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  checked = false;
  name: string;
  spinnerConfig: object = {
    bdColor: "#333",
    size: "large",
    color: "#fff"
  };
  public error: string;
  public profileinfo: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private data: DataService,
    private spinner: NgxSpinnerService,
    private auth: AuthService
  ) {
    this.name = `ngx-spinner`;
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      checked: [false]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.spinner.show();

    this.auth
      .login(
        this.loginForm.get("email").value,
        this.loginForm.get("password").value
      )
      .pipe(first())
      .subscribe(
        result => {
          localStorage.setItem("username", this.loginForm.get("email").value);

          this.auth
            .getProfile(localStorage.getItem("username"))
            .pipe(first())
            .subscribe(
              result => {
                console.log("result is:", result, result._source.emailverified);
                this.profileinfo = result;

                if (this.profileinfo._source.emailverified === "No") {
                  localStorage.setItem(
                    "employeeid",
                    this.profileinfo._source.employeeid
                  );
                  this.router.navigate(["resetpassword"]);
                  return;
                }
                if (this.profileinfo._source.adminaccess === true) {
                  localStorage.setItem("checked", "true");
                  localStorage.setItem(
                    "name",
                    this.profileinfo._source.firstname
                  );
                  localStorage.setItem(
                    "employeeid",
                    this.profileinfo._source.employeeid
                  );
                  this.router.navigate(["createaccount"]);
                } else {
                  localStorage.setItem("checked", "false");
                  localStorage.setItem(
                    "name",
                    this.profileinfo._source.firstname
                  );
                  localStorage.setItem(
                    "employeeid",
                    this.profileinfo._source.employeeid
                  );
                  this.router.navigate(["viewprofile"]);
                }
                setTimeout(() => {
                  this.spinner.hide(); // To hide the spinner
                }, 10000);
              },
              err => {
                console.log("error is:", err);
              }
            );
        },
        err => {
          this.error = "Could not authenticate";
          setTimeout(() => {
            this.spinner.hide(); // To hide the spinner
          }, 1000);
          alert("Authentication failed");
        }
      );
  }
}
