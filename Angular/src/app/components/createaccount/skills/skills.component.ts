import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../providers/auth.service";
import { first } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-skills",
  templateUrl: "./skills.component.html",
  styleUrls: ["./skills.component.scss"]
})
export class SkillsComponent implements OnInit {
  private skills: Array<any> = [];
  private skillsAttribute: any = {};
  submitcheck = 0;
  submitbutton = false;
  public loading = false;
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.loading = true;
    this.auth
      .getemployeedetailselastic(localStorage.getItem("employeeid"))
      .pipe(first())
      .subscribe(
        result => {
          console.log('skills', result);
          this.loading = false;
          if (result._source.skills.length !=0) {
            this.skills = result._source.skills;
          }
          for (let i = 0; i < this.skills.length; i++) {
            this.submitcheck++;
          }
          if (this.submitcheck > 0) this.submitbutton = true;
        },
        err => {
          console.log(err);
          alert("error while get employee details");
          this.loading = false;
        }
      );
  }
  addskill() {
    if (!this.skillsAttribute.skillname) {
      alert("Skill Name cannot be empty");
      return;
    }
    if (!this.skillsAttribute.proficiency) {
      alert("Proficiency cannot be empty");
      return;
    }
    this.submitcheck++;
    if (this.submitcheck > 0) {
      this.submitbutton = true;
    }
    this.skills.push(this.skillsAttribute);
    this.skillsAttribute = {};
    //console.log('fieldArray',this.fieldArray)
  }

  deleteskill(index) {
    this.skills.splice(index, 1);
    this.submitcheck--;
    if (this.submitcheck === 0) {
      this.submitbutton = false;
    }
  }
  onsave() {
    this.loading = true;
    var object = {
      employeeid: localStorage.getItem("employeeid"),
      skills: this.skills
    };
    console.log('object for assets',object);
    this.auth
      .saveskills(object)
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
