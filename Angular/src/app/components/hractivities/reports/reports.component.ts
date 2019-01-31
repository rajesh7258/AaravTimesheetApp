import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { AuthService } from "../../../providers/auth.service";
import { first } from "rxjs/operators";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  startdate:FormControl;
  enddate:FormControl;
  employeename:FormControl;
  manageremail:FormControl;
  isall = false;
  isemployee = false;
  ismanager = false;
  employeelist = [ ];
  group = "";
  managerlist = [ ];

  employeeid= "";
  managerid = "";

  constructor( private auth: AuthService ) { 
    this.startdate = new FormControl();
    this.enddate = new FormControl();
    this.employeename = new FormControl();
    this.manageremail = new FormControl();
  }

  ngOnInit() {
    this.auth
      .getallemployeedetailselastic()
      .pipe(first())
      .subscribe(
        result => {
          console.log('reports result', result)
                if (result.hits.total > 0) {
                  for (let i = 0; i < result.hits.hits.length; i++) {
                    if(result.hits.hits[i]._source.manager) {
                      this.managerlist.push(
                        {"username":result.hits.hits[i]._source.firstname+result.hits.hits[i]._source.lastname, 
                        "managerid":result.hits.hits[i]._source.employeeid,
                        "manageremail":result.hits.hits[i]._source.username
                      }
                      )
                    }
                    this.employeelist.push(
                      {"username":result.hits.hits[i]._source.firstname+result.hits.hits[i]._source.lastname, 
                        "employeeid":result.hits.hits[i]._source.employeeid}
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
  }

  changeonselect(event) {
    console.log('event value', event.value);
    if(event.value == "All") {
      this.isall = true;
      this.isemployee = false;
      this.ismanager = false;
      this.group = 'all';
    }
    if(event.value == "By Employee") {
      this.isall = false;
      this.isemployee = true;
      this.ismanager = false;
      this.group = 'byemployee';
    }
    if(event.value == "By Manager") {
      this.isall = false;
      this.isemployee = false;
      this.ismanager = true;
      this.group = 'bymanager';
    }
  }

  changeemployeeview(event) {
    console.log('event value', event.value);
    this.employeeid=event.value;
  }

  changemanagerview(event) {
    console.log('event value', event.value);
    this.managerid=event.value;
  }

  onGenerate() {
    if (!this.startdate.value) {
      alert("start date is not entered");
    }
    if (!this.enddate.value) {
      alert("end date is not entered");
    }
    var object = {
      "group": this.group,
      "startdate": this.startdate.value,
      "enddate": this.enddate.value
    }
    
    if(this.group == 'byemployee') {
      object["employeeid"] = this.employeename.value;
    }
    if(this.group == 'bymanager') {
      object["managerid"] = this.manageremail.value;
    }

    console.log('object',object);
    this.auth
    .getreports(object)
    .pipe(first())
    .subscribe(
      result => {
        console.log('reports result', result);
        if(result.status === "nofind") {
          alert("No results found")
        }
        else {
          //csv logic
          var json = [];

          for (let i = 0; i < result.response.hits.hits.length; i++) {
            var status = "";
            var comment = "N/A";
            if( result.response.hits.hits[i]._source.managerstatus === "New") {
                status = "Submitted";
            }
            if( result.response.hits.hits[i]._source.managerstatus === "Approved") {
              status = "Approved";
            }
            var fromdate = new Date(result.response.hits.hits[i]._source.startdate);
            var todate = new Date(result.response.hits.hits[i]._source.enddate);
            if (result.response.hits.hits[i]._source.weekendentry.length !== 0) {
              for (let j = 0; j < result.response.hits.hits[i]._source.weekendentry.length; j++) {
                json.push({
                  'Employee Id': result.response.hits.hits[i]._source.employeeid,
                  'Manager Name': result.response.hits.hits[i]._source.managername,
                  'From Date': fromdate.getDate() + '/' + fromdate.getMonth()+1 + '/' + fromdate.getFullYear(),
                  'To Date': todate.getDate() + '/' + todate.getMonth()+1 + '/' + todate.getFullYear(),
                  'Monday': result.response.hits.hits[i]._source.weekendentry[j].mon,
                  'Tuesday': result.response.hits.hits[i]._source.weekendentry[j].tue,
                  'Wednesday': result.response.hits.hits[i]._source.weekendentry[j].wed,
                  'Thursday': result.response.hits.hits[i]._source.weekendentry[j].thu,
                  'Friday': result.response.hits.hits[i]._source.weekendentry[j].fri,
                  'Saturday': result.response.hits.hits[i]._source.weekendentry[j].sat,
                  'Sunday': result.response.hits.hits[i]._source.weekendentry[j].sun,
                  'WorkingHours': result.response.hits.hits[i]._source.weekendentry[j].total,
                  'Client': 'N/A',
                  'Project': 'N/A',
                  'status': status,
                  'comment': result.response.hits.hits[i]._source.weekendentry[j].task
                })
              }
            }
            var mon = 0, tue = 0, wed = 0, thu = 0, fri = 0, sat = 0, sun = 0, total = 0;
            for (let k = 0; k < result.response.hits.hits[i]._source.weekentry.length; k++) {
              mon = mon | result.response.hits.hits[i]._source.weekentry[k].mon;
              tue = tue | result.response.hits.hits[i]._source.weekentry[k].tue;
              wed = wed | result.response.hits.hits[i]._source.weekentry[k].wed;
              thu = thu | result.response.hits.hits[i]._source.weekentry[k].thu;
              fri = fri | result.response.hits.hits[i]._source.weekentry[k].fri;
              sat = sat | result.response.hits.hits[i]._source.weekentry[k].sat;
              sun = sun | result.response.hits.hits[i]._source.weekentry[k].sun;
              total = total + result.response.hits.hits[i]._source.weekentry[k].total;
            }
            json.push({
              'Employee Id': result.response.hits.hits[i]._source.employeeid,
              'Manager Name': result.response.hits.hits[i]._source.managername,
              'From Date': fromdate.getDate() + '/' + fromdate.getMonth()+1 + '/' + fromdate.getFullYear(),
              'To Date': todate.getDate() + '/' + todate.getMonth()+1 + '/' + todate.getFullYear(),
              'Monday': mon,
              'Tuesday': tue,
              'Wednesday': wed,
              'Thursday': thu,
              'Friday': fri,
              'Saturday': sat,
              'Sunday': sun,
              'WorkingHours': total,
              'Client': result.response.hits.hits[i]._source.weekentry[0].client,
              'Project': result.response.hits.hits[i]._source.weekentry[0].project,
              'status': status,
              'comment': 'N/A'
            })
          }

          console.log('json data to convert to xlsx', json);
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
          const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
          XLSX.writeFile(workbook, 'timesheet.xlsx');
        }
      },
      err => {
        alert("Error while retriving employee info contact admin");
      }
    );
  }
}
