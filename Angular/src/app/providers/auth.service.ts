import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment.prod";
import { ConstantPool } from "@angular/compiler/src/constant_pool";
import 'rxjs/add/operator/toPromise';
@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient) {}
  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<{ token: string }>(environment.Nodeserver + "/api/signin", {
        username: username,
        password: password
      })
      .pipe(
        map(result => {
          localStorage.setItem("access_token", result.token);
          return true;
        })
      );
  }

  updatepassword(object): Observable<boolean> {
    return this.http
      .post<{ token: string }>(
        environment.Nodeserver + "/api/resetpassword",
        object
      )
      .pipe(
        map(result => {
          localStorage.setItem("access_token", result.token);
          return true;
        })
      );
  }

  forgetpassword(object): Observable<boolean> {
    return this.http
      .post<{ token: string }>(
        environment.Nodeserver + "/api/forgetpassword",
        object
      )
      .pipe(
        map(result => {
          localStorage.setItem("access_token", result.token);
          return true;
        })
      );
  }
  getProfile(username: any): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/getprofile", {
        username: username
      })
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  getmanagerprojects(employeeid: any): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/getmanagerprojects", {
        employeeid: employeeid
      })
      .pipe(
        map(result => {
          console.log("result is ", result);
          return result;
        })
      );
  }
  submittimesheet(object: any): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/addtimesheetentry", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  gettimesheet(object: any): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/gettimesheetentry", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getreports(object: any): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/getreports", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getManagerlist(): Observable<any> {
    return this.http
      .get(environment.Elasticsearch + "/managers/manager/1")
      .pipe(
        map(result => {
          console.log('manager list'+ result);
          return result;
        })
      );
  }

  getemployeedetailselastic(empid): Observable<any> {
    return this.http
      .get(environment.Elasticsearch + "/employees/employee/" + empid)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getallemployeedetailselastic(): Observable<any> {
    return this.http
      .get(environment.Elasticsearch + "/employees/employee/_search" )
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getholidaylistelastic(): Observable<any> {
    return this.http
      .get(environment.Elasticsearch + "/holidays/holiday/1")
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getclientelastic(): Observable<any> {
    return this.http.get(environment.Elasticsearch + "/clients/client/1").pipe(
      map(result => {
        return result;
      })
    );
  }
  getprojectelastic(): Observable<any> {
    return this.http
      .get(environment.Elasticsearch + "/projects/project/1")
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  getholidaylist(object): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/getholidaylist", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  getapprovetimesheet(object): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/getapprovetimesheet", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  getleavestoapprove(object: any): Observable<any> {
    return this.http
      .post(environment.Elasticsearch + "/leaves/leave/_search?pretty", {
        query: {
          bool: {
            must: [
              {
                match: {
                  manageremail: object.username
                }
              },
              {
                match: {
                  status: "Pending"
                }
              }
            ]
          }
        }
      })
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  getemployeebymanagerid(object): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/getemployeesbymanager", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  refreshindex(index: any): Observable<any> {
    return this.http
      .post(environment.Elasticsearch + "/" + index + "/_refresh", {})
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  saveskills(object: any): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/saveskills", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  saveitassets(object: any): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/saveassets", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  saveholiday(object: any): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/updateholidaylist", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  addnewproject(object: any): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/addnewprojectentry", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  addnewclient(object: any): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/addnewclinet", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  updatemeployeeprojects(object: any): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/updateemployeeprojects", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getholidaybydate(object: any): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/getholidaybydate", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  async gettimesheetholidaybydate(object: any) {
    return await this.http.post(environment.Nodeserver + "/api/gettimesheetholidaybydate", object).toPromise();
  }

  async getleavebydate(object: any) {
    return await this.http.post(environment.Nodeserver + "/api/getleavebydate", object).toPromise();
  }

  async getProfileById(employeeid: any) {
    return await this.http.post(environment.Nodeserver + "/api/getuserprofilebyid", {
        employeeid: employeeid
      }).toPromise();
  }

  saveleave(object: any): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/addleaveentry", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  saveFile(object: any): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/saveFiles", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  updateleave(object: any): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/updateleavesforemployee", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  reupdateleave(object: any): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/reupdateleavesforemployee", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  register(object: any): Observable<any> {
    return this.http
      .post<{ token: string }>(environment.Nodeserver + "/api/register", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getleavesforemployee(object): Observable<any> {
    return this.http
      .post(environment.Elasticsearch + "/leaves/leave/_search?pretty", {
        query: {
          match: {
            employeeid: object.employeeid
          }
        }
      })
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  approveleave(id: any, object): Observable<any> {
    console.log("id:", id);

    return this.http
      .post(
        environment.Elasticsearch + "/leaves/leave/" + id + "/_update?pretty",
        object
      )
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  sendrejectleaveemail(object): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/sendrejectleaveemail", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  sendtimesheetrejectemail(object): Observable<any> {
    return this.http
      .post(environment.Nodeserver + "/api/sendtimesheetrejectemail", object)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  deleteFile(object: any): Observable<any> {
    return this.http
            .post(environment.Nodeserver + "/api/file/delete", object)
            .pipe(
              map(result => {
                return result;
              })
            );
  }

  deleteleaverequest(id): Observable<any> {
    console.log("Id to be deleted", id);
    return this.http
      .delete(environment.Elasticsearch + "/leaves/leave/" + id)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  public get loggedIn(): boolean {
    return localStorage.getItem("access_token") !== null;
  }
}

@Injectable()
export class NavbarService {
  constructor() {}
  getprimary() {
    return localStorage.getItem("primary");
  }
  getproject() {
    return localStorage.getItem("project");
  }
  gethealth() {
    return localStorage.getItem("health");
  }
  getskills() {
    return localStorage.getItem("skills");
  }
}
