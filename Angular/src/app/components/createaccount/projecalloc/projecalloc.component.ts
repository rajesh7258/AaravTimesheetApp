import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../providers/auth.service";
import { first } from "rxjs/operators";
@Component({
  selector: 'app-projecalloc',
  templateUrl: './projecalloc.component.html',
  styleUrls: ['./projecalloc.component.scss']
})
export class ProjecallocComponent implements OnInit {

  public loading = false;
  public projectlist : Array<any> = [];

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth
    .getemployeedetailselastic(localStorage.getItem("employeeid"))
    .pipe(first())
    .subscribe(
      result => {
        console.log('checking for project list',result);
        this.loading = false;
        this.projectlist = result._source.projects;
        console.log('project list',this.projectlist);
      },
      err => {
        console.log(err);
        alert("error while get employee details");
        this.loading = false;
      }
    );
  }

}
