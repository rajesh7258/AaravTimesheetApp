import { Routes } from "@angular/router";

import { CreateCustomerComponent } from "../../create-customer/create-customer.component";
import { TimesheetComponent } from "../../timesheet/timesheet.component";
import { CreateCalenderComponent } from "../../create-calender/create-calender.component";
import { ViewHolidayComponent } from "../../view-holiday/view-holiday.component";
import { ViewProfileComponent } from "../../view-profile/view-profile.component";
import { PrimaryComponent } from "../../components/createaccount/primary/primary.component";
import { ProjectComponent } from "../../components/createaccount/project/project.component";
import { HealthComponent } from "../../components/createaccount/health/health.component";
import { SkillsComponent } from "../../components/createaccount/skills/skills.component";
import { AuthGuardPrimary } from "../../../app/providers/auth.guard";
import { WorkexpComponent } from "../../components/createaccount/workexp/workexp.component";
import { ProjecallocComponent } from "../../components/createaccount/projecalloc/projecalloc.component";
import { ManageractivitesComponent } from "../../manageractivites/manageractivites.component";
import { CreateprojectComponent } from "../../components/manageractivity/createproject/createproject.component";
import { AllocatedeallocateprojComponent } from "../../components/manageractivity/allocatedeallocateproj/allocatedeallocateproj.component";
import { ApprovetimesheetComponent } from "../../components/manageractivity/approvetimesheet/approvetimesheet.component";
import { ApproveleaveComponent } from "../../components/manageractivity/approveleave/approveleave.component";
import { MyrequestsComponent } from "../../myrequests/myrequests.component";
import { LeaveComponent } from "../../components/myrequest/leave/leave.component";
import { MaternalLeaveComponent } from "../../components/myrequest/maternal-leave/maternal-leave.component";
import { PaternalLeaveComponent } from "../../components/myrequest/paternal-leave/paternal-leave.component";
import { ReportsComponent } from "../../components/hractivities/reports/reports.component";
import { TrackasssetsComponent } from "../../components/itactivities/trackasssets/trackasssets.component";
import { HractivitiesComponent } from "../../hractivities/hractivities.component";
import { ItactivitiesComponent } from "../../itactivities/itactivities.component";

export const AdminLayoutRoutes: Routes = [
  { path: "createaccount", component: CreateCustomerComponent },
  { path: "timesheet", component: TimesheetComponent },
  { path: "createholiday", component: CreateCalenderComponent },
  { path: "viewholiday", component: ViewHolidayComponent },
  {
    path: "viewprofile",
    component: ViewProfileComponent,
    children: [
      { path: "", redirectTo: "primary", component: PrimaryComponent },
      {
        path: "primary",
        component: PrimaryComponent
      },
      { path: "skills", component: SkillsComponent },
      { path: "projectallocation", component: ProjecallocComponent },
      { path: "workexp", component: WorkexpComponent }
    ]
  },
  {
    path: "manageractivites",
    component: ManageractivitesComponent,
    children: [
      {
        path: "",
        redirectTo: "createproject",
        component: CreateprojectComponent
      },
      {
        path: "createproject",
        component: CreateprojectComponent
      },
      { path: "allocatdeallocate", component: AllocatedeallocateprojComponent },
      { path: "approvetimesheet", component: ApprovetimesheetComponent },
      { path: "approveleave", component: ApproveleaveComponent }
    ]
  },
  {
    path: "myrequest",
    component: MyrequestsComponent,
    children: [
      {
        path: "",
        redirectTo: "leave",
        component: LeaveComponent
      },
      {
        path: "leave",
        component: LeaveComponent
      },
      { path: "maternalleave", component: MaternalLeaveComponent },
      { path: "paternalleave", component: PaternalLeaveComponent }
    ]
  },
  {
    path: "createaccount",
    component: CreateCustomerComponent
    /*children: [
      { path: "", redirectTo: "primary", component: PrimaryComponent },
      {
        path: "primary",
        component: PrimaryComponent
      },
      { path: "project", component: ProjectComponent },
      { path: "health", component: HealthComponent },
      { path: "skills", component: SkillsComponent }
    ]*/
  },
  {
    path: "hr",
    component: HractivitiesComponent,
    children: [
      {
        path: "",
        redirectTo: "reports",
        component: ReportsComponent
      },
      {
        path: "reports",
        component: ReportsComponent
      }
    ]
  },
  {
    path: "it",
    component: ItactivitiesComponent,
    children: [
      {
        path: "",
        redirectTo: "trackassets",
        component: TrackasssetsComponent
      },
      {
        path: "trackassets",
        component: TrackasssetsComponent
      }
    ]
  },
];
