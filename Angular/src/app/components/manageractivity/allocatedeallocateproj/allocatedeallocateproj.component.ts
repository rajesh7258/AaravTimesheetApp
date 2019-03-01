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
  selector: "app-allocatedeallocateproj",
  templateUrl: "./allocatedeallocateproj.component.html",
  styleUrls: ["./allocatedeallocateproj.component.scss"]
})
export class AllocatedeallocateprojComponent implements OnInit {
  public loading = false;
  public employeelist = [];
  public projectlist: any = [];
  public choosenemployeeid = "";
  public dropdownprojectlist = [];
  public clientlist = [];
  public hits = [];
  public clientproject = [];
  public projectattribute: any = {};
  public employeefound = false;
  public clientchoosen = false;
  public employeeid = "";
  public emailaddress = "";
  public submitbutton = false;
  public name = "";

  constructor(private auth: AuthService) {
    this.auth
      .getProfile(localStorage.getItem("username"))
      .pipe(first())
      .subscribe(
        result => {
          //tresult._source.firstname;
          this.auth
            .getemployeebymanagerid({ firstname: result._source.firstname })
            .pipe(first())
            .subscribe(
              result => {
                console.log(result);
                if (result.response.hits.total > 0) {
                  for (let i = 0; i < result.response.hits.hits.length; i++) {
                    this.employeelist.push(
                      result.response.hits.hits[i]._source
                    );
                  }
                } else {
                  alert("No Employees found under this Manager contact admin");
                }
                console.log(this.employeelist);
              },
              err => {
                alert("Error while retriving employee info contact admin");
              }
            );
        },
        err => {
          alert("Error while retriving employee info contact admin");
        }
      );
    /*this.auth
      .getclientelastic()
      .pipe(first())
      .subscribe(
        result => {
          this.clientlist = result._source.clientlist;
        },
        err => {
          alert("Error in getting client date contact admin ");
        }
      );*/
    this.auth
      .getmanagerprojects(localStorage.getItem("employeeid"))
      .pipe(first())
      .subscribe(
        result => {
          console.log("projects", result);
          var hits = [];
          if (result.response.hits.total != 0) {
            hits =
              result.response.hits.hits[0].inner_hits.projectlist.hits.hits;
            for (let i = 0; i < hits.length; i++) {
              this.clientlist.push({ name: hits[i]._source.clientname });
            }
            for (let i = 0; i < hits.length; i++) {
              this.clientproject.push(hits[i]._source);
            }
          }
          console.log(this.clientproject);
        },
        err => {
          alert("Error in getting client date contact admin ");
        }
      );
  }

  ngOnInit() {}

  changeemployeeview(event) {
    this.loading = true;
    this.employeefound = false;
    console.log(event.value);
    this.projectlist = [];
    this.submitbutton = false;
    this.choosenemployeeid = event.value;
    this.auth
      .getProfile(event.value)
      .pipe(first())
      .subscribe(
        result => {
          console.log(result);
          //this.projectlist = result._source.projectlist;
          if (result._source.projects.length > 0) {
            this.projectlist = result._source.projects;
          }
          for (let j = 0; j < this.employeelist.length; j++) {
            if (this.employeelist[j].username === event.value) {
              this.emailaddress = this.employeelist[j].username;
              this.name = this.employeelist[j].firstname;
              this.employeeid = this.employeelist[j].employeeid;
            }
          }
          this.employeefound = true;
          this.loading = false;
        },
        err => {
          alert("Error while retriving employee info contact admin");
          this.loading = false;
        }
      );
  }
  changeprojectview(event) {
    this.loading = true;
    this.dropdownprojectlist = [];
    for (let i = 0; i < this.clientproject.length; i++) {
      if (event.value === this.clientproject[i].clientname) {
        this.dropdownprojectlist.push({ name: this.clientproject[i].name });
      }
    }
    this.loading = false;
  }
  assignproject() {
    console.log("assigned project", this.projectattribute);
    if (!this.projectattribute.clientname) {
      alert("please select client");
      return;
    }
    if (!this.projectattribute.projectname) {
      alert("please select project");
      return;
    }
    if (!this.projectattribute.eststartdate) {
      alert("start date cannot be empty");
      return;
    }
    if (!this.projectattribute.estenddate) {
      alert("end date cannot be empty");
      return;
    }
    if (
      this.projectattribute.estenddate.getTime() <
      this.projectattribute.eststartdate.getTime()
    ) {
      alert("end date cannot be less than startdate");
      return;
    }
    this.projectattribute["status"] = "active";
    this.projectattribute["createddate"] = new Date();
    this.projectattribute["createddate"] = new Date();

    this.projectlist.push(this.projectattribute);
    this.projectattribute = {};
    this.submitbutton = true;
  }
  deleteprojectValue(index) {
    this.projectlist.splice(index, 1);
    if (this.projectlist.length >= 0) {
      this.submitbutton = true;
    } else {
      this.submitbutton = false;
    }
  }
  onSave() {
    this.loading = true;
    var employeeid = "";
    for (let i = 0; i < this.employeelist.length; i++) {
      if (this.employeelist[i].username === this.choosenemployeeid) {
        employeeid = this.employeelist[i].employeeid;
      }
    }
    var object = {
      employeeid: employeeid,
      projectlist: this.projectlist
    };
    this.auth
      .updatemeployeeprojects(object)
      .pipe(first())
      .subscribe(
        result => {
          alert("Sucessfully updated employee projects sucessfully");
          this.loading = false;
        },
        err => {
          alert("Error while updating employee projects contact admin");
          this.loading = false;
        }
      );
  }
}
