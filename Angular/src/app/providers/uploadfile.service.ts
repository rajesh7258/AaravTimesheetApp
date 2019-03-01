import { Injectable } from "@angular/core";
import { HttpClient, HttpEvent, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.prod";
@Injectable({
  providedIn: "root"
})
export class UploadFileService {
  constructor(private http: HttpClient) {}

  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append("file", file);

    const req = new HttpRequest(
      "POST",
      environment.Nodeserver + "/api/file/upload",
      formdata,
      {
        reportProgress: true,
        responseType: "text"
      }
    );
    console.log('upload',this.http.request(req));
    return this.http.request(req);
  }
}
