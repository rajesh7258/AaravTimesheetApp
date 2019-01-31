import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  HostBinding
} from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import { first } from "rxjs/operators";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "../../providers/auth.service";
import { interval } from "rxjs";
import { DataService } from "../../providers/data/data.service";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: "/devices", title: "Devices", icon: "design_app", class: "" },
  { path: "/settings", title: "Settings", icon: "loader_gear", class: "" },
  {
    path: "/user-profile",
    title: "User Profile",
    icon: "users_single-02",
    class: ""
  },
  {
    path: "/recentdata",
    title: "Table List",
    icon: "design_bullet-list-67",
    class: ""
  }
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger("rotatedState", [
      state("default", style({ transform: "rotate(0)" })),
      state("rotated", style({ transform: "rotate(-360deg)" })),
      transition("rotated => default", animate("500ms ease-out")),
      transition("default => rotated", animate("400ms ease-in"))
    ])
  ]
})
export class SidebarComponent implements OnInit {
  ishr = false;
  isadmin = false;
  ismanager = false;
  menuItems: any[];
  state: string = "default";
  rotateflag: boolean = true;
  admindata = null;
  parsetmp: any;
  rotatecount = 0;
  intervel: any;
  interval: any;
  constructor(
    private rotateimg: ElementRef,
    //private data: DataService,
    private router: Router,
    private auth: AuthService
  ) {
    /*this.admindata = JSON.stringify(this.data.storage);
    console.log(this.admindata);
    this.parsetmp = JSON.parse(this.admindata);
    console.log("admin data is", this.parsetmp["checked"]);
    this.isadmin = this.parsetmp["checked"];*/
    this.auth
      .getProfile(localStorage.getItem("username"))
      .pipe(first())
      .subscribe(
        result => {
          console.log("sidenav result", result);
          this.isadmin = result._source.itadmin;
          this.ismanager = result._source.manager;
          if( result._source.department === "HR" ) {
            this.ishr = true;
          }
        },
        err => {
          console.log("error is:", err);
        }
      );
    //this.isadmin = localStorage.getItem("checked");
  }
  ngOnInit() {
    this.interval = setInterval(() => {
      this.rotate();
    }, 1000);
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }

  rotate() {
    this.state = this.state === "default" ? "rotated" : "default";
    this.rotatecount++;
    if (this.rotatecount === 2) {
      clearInterval(this.interval);
    }
  }
}
