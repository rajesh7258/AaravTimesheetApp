import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { AuthService } from "../../../providers/auth.service";
import { first } from "rxjs/operators";

@Component({
  selector: 'app-trackasssets',
  templateUrl: './trackasssets.component.html',
  styleUrls: ['./trackasssets.component.scss']
})
export class TrackasssetsComponent implements OnInit {
  public loading = false;
  public employeelist = [];
  public employeefound = false;
  public employeeid = "";
  public emailaddress = "";
  public name = "";
  public currentempindex: number;
  private itassets: Array<any> = [];
  private itassetsAttribute: any = {};
  submitcheck = 0;
  submitbutton = false;

  constructor(private auth: AuthService) { 
    this.auth
      .getProfile(localStorage.getItem("username"))
      .pipe(first())
      .subscribe(
        result => {
          //tresult._source.firstname;
          this.auth
            .getallemployeedetailselastic()
            .pipe(first())
            .subscribe(
              result => {
                console.log(result);
                if (result.hits.total > 0) {
                  for (let i = 0; i < result.hits.hits.length; i++) {
                    this.employeelist.push(
                      result.hits.hits[i]._source
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
  }

  ngOnInit() {
  }

  changeemployeeview(event) {
    this.loading = true;
    console.log(event.value);
    for (let j = 0; j < this.employeelist.length; j++) {
      if (this.employeelist[j].username === event.value) {
        this.currentempindex = j;
        this.emailaddress = this.employeelist[j].username;
        this.name = this.employeelist[j].firstname;
        this.employeeid = this.employeelist[j].employeeid;
        this.itassets = this.employeelist[j].itassets;
      }
    }
    this.employeefound = true;
    this.loading = false;
  }

  additasset() {
    if (!this.itassetsAttribute.name) {
      alert("itasset Name cannot be empty");
      return;
    }
    if (!this.itassetsAttribute.id) {
      alert("Proficiency cannot be empty");
      return;
    }
    if (!this.itassetsAttribute.type) {
      alert("Proficiency cannot be empty");
      return;
    }
    this.submitcheck++;
    if (this.submitcheck > 0) {
      this.submitbutton = true;
    }
    this.itassets.push(this.itassetsAttribute);
    this.itassetsAttribute = {};
    //console.log('fieldArray',this.fieldArray)
  }

  deleteitasset(index) {
    this.itassets.splice(index, 1);
    this.submitcheck--;
    if (this.submitcheck === 0) {
      this.submitbutton = false;
    }
  }
  onsave() {
    this.loading = true;
    var object = {
      employeeid: this.employeelist[this.currentempindex].employeeid,
      itassets: this.itassets
    };
    console.log('object for assets',object);
    this.auth
      .saveitassets(object)
      .pipe(first())
      .subscribe(
        result => {
          console.log("result", result);
          this.loading = false;
        },
        err => {
          this.loading = false;
          console.log("error is:", err);
        }
      );
  }
}
