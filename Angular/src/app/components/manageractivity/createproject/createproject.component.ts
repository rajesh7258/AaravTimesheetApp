import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { AuthService } from "../../../providers/auth.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-createproject",
  templateUrl: "./createproject.component.html",
  styleUrls: ["./createproject.component.scss"]
})
export class CreateprojectComponent implements OnInit {
  public createproject: FormGroup;
  public clientlist: any = [];
  public projectlist: any = [];
  public isnewclient = false;
  public maxDate = new Date();
  public loading = false;
  constructor(private formBuilder: FormBuilder, private auth: AuthService) {}

  ngOnInit() {
    this.createproject = this.formBuilder.group({
      projectname: ["", [Validators.required]],
      client: ["", [Validators.required]],
      createclient: [false],
      description: ["", [Validators.required]],
      estimatedstartdate: ["", [Validators.required]],
      estimatedenddate: ["", [Validators.required]]
    });

    this.auth
      .getclientelastic()
      .pipe(first())
      .subscribe(
        result => {
          console.log(result);
          this.clientlist = result._source.clientlist;
        },
        err => {
          alert("Error in getting client date contact admin ");
        }
      );

    this.auth
      .getprojectelastic()
      .pipe(first())
      .subscribe(
        result => {
          console.log(result);
          this.projectlist = result._source.projectlist;
        },
        err => {
          alert("Error in getting project date contact admin ");
        }
      );
  }

  get f() {
    return this.createproject.controls;
  }
  newclinet(event) {
    if (event.checked === true) {
      this.isnewclient = true;
    } else {
      this.isnewclient = false;
    }
  }

  onSubmit() {
    console.log("Inside on submit");
    this.loading = true;
    if (this.projectlist.length != 0) {
      var currentproject = this.createproject.controls.projectname.value;
      var clinetname = this.createproject.controls.client.value;
      //check wether client and project combo exists or not
      for (let i = 0; i < this.projectlist.length; i++) {
        if (
          this.projectlist[i].name === currentproject &&
          this.projectlist[i].clientname === clinetname
        ) {
          alert("Project and Client combination already exist");
          this.loading = false;
          return;
        }
      }
    }
    if (this.createproject.controls.createclient.value === true) {
      var enteredclinet = this.createproject.controls.client.value;
      for (let i = 0; i < this.clientlist.length; i++) {
        if (this.clientlist[i].name === enteredclinet) {
          alert("New client is already taken");
          this.loading = false;
          return;
        }
      }
    }
    var object = [];
    object.push({
      name: this.createproject.controls.projectname.value,
      clientname: this.createproject.controls.client.value,
      eststartdate: this.createproject.controls.estimatedstartdate.value,
      estenddate: this.createproject.controls.estimatedenddate.value,
      status: "active",
      createdate: new Date(),
      createby: localStorage.getItem("employeeid")
    });
    console.log(object);
    this.auth
      .addnewproject(object)
      .pipe(first())
      .subscribe(
        result => {
          if (this.createproject.controls.createclient.value === true) {
            var clientobject = [];
            clientobject.push({
              name: this.createproject.controls.client.value,
              createby: localStorage.getItem("employeeid"),
              createdate: new Date(),
              status: "active"
            });
            (clientobject["name"] = this.createproject.controls.client.value),
              this.auth
                .addnewclient(clientobject)
                .pipe(first())
                .subscribe(
                  result => {
                    this.auth
                      .refreshindex("clients")
                      .pipe(first())
                      .subscribe(
                        result => {
                          this.auth
                            .getclientelastic()
                            .pipe(first())
                            .subscribe(
                              result => {
                                console.log(result);
                                this.clientlist = result._source.clientlist;
                              },
                              err => {
                                this.loading = false;
                                alert(
                                  "Error in getting project data contact admin "
                                );
                              }
                            );
                        },
                        err => {
                          this.loading = false;
                          alert(
                            "Error while refreshing project  contact admin "
                          );
                        }
                      );
                  },
                  err => {
                    this.loading = false;
                    alert("Error while adding new client contact admin");
                  }
                );
          }
          this.auth
            .refreshindex("projects")
            .pipe(first())
            .subscribe(
              result => {
                this.auth
                  .getprojectelastic()
                  .pipe(first())
                  .subscribe(
                    result => {
                      console.log(result);
                      this.projectlist = result._source.projectlist;
                    },
                    err => {
                      this.loading = false;
                      alert("Error in getting project data contact admin ");
                    }
                  );
              },
              err => {
                this.loading = false;
                alert("Error while refreshing project  contact admin ");
              }
            );
          this.loading = false;
        },
        err => {
          this.loading = false;
          alert("Error while adding project  contact admin ");
        }
      );
  }
}
