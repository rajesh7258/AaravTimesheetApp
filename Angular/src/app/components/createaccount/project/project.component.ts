import { Component, OnInit, ChangeDetectorRef, NgZone } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { CreateprofilenavbarComponent } from "../createprofilenavbar/createprofilenavbar.component";
import { NavbarService } from "../../../providers/auth.service";
@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ProjectComponent implements OnInit {
  public employeeid: any;
  Employeeid: FormControl;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private navservice: NavbarService,
    private ngzone: ChangeDetectorRef
  ) {}

  ngOnInit() {}
}
