import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { ReportnavbarComponent } from "./reportnavbar/reportnavbar.component";
import { CreateprofilenavbarComponent } from "./createaccount/createprofilenavbar/createprofilenavbar.component";
import { PrimaryComponent } from "./createaccount/primary/primary.component";
import { ProjectComponent } from "./createaccount/project/project.component";
import { HealthComponent } from "./createaccount/health/health.component";
import { SkillsComponent } from "./createaccount/skills/skills.component";
import { FileSelectDirective } from "ng2-file-upload";
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { AtomSpinnerModule } from "angular-epic-spinners";
import { AuthGuardPrimary } from "../../app/providers/auth.guard";
import { NavbarService } from "../providers/auth.service";
import { AnimateOnScrollModule } from "ng2-animate-on-scroll";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { WorkexpComponent } from "./createaccount/workexp/workexp.component";
import { ProjecallocComponent } from "./createaccount/projecalloc/projecalloc.component";
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { CreateprojectComponent } from "./manageractivity/createproject/createproject.component";
import { AllocatedeallocateprojComponent } from "./manageractivity/allocatedeallocateproj/allocatedeallocateproj.component";
import { ApprovetimesheetComponent } from "./manageractivity/approvetimesheet/approvetimesheet.component";
import { ApproveleaveComponent } from "./manageractivity/approveleave/approveleave.component";
import { ManagernavbarComponent } from "./manageractivity/managernavbar/managernavbar.component";
import { ViewtimesheetComponent } from "./manageractivity/viewtimesheet/viewtimesheet.component";
import { LeaveComponent } from "./myrequest/leave/leave.component";
import { MaternalLeaveComponent } from "./myrequest/maternal-leave/maternal-leave.component";
import { PaternalLeaveComponent } from "./myrequest/paternal-leave/paternal-leave.component";
import { MyrequestnavbarComponent } from "./myrequest/myrequestnavbar/myrequestnavbar.component";
import { ReportsComponent } from './hractivities/reports/reports.component';
import { HrnavbarComponent } from './hractivities/hrnavbar/hrnavbar.component';
//import { RejectleaveComponent } from "./manageractivites/rejectleave/rejectleave.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    AtomSpinnerModule,
    AnimateOnScrollModule.forRoot(),
    MatExpansionModule,
    MatIconModule,
    NgxLoadingModule.forRoot({})
  ],
  declarations: [
    NavbarComponent,
    SidebarComponent,
    ReportnavbarComponent,
    CreateprofilenavbarComponent,
    PrimaryComponent,
    ProjectComponent,
    HealthComponent,
    SkillsComponent,
    FileSelectDirective,
    WorkexpComponent,
    ProjecallocComponent,
    CreateprojectComponent,
    AllocatedeallocateprojComponent,
    ApprovetimesheetComponent,
    ApproveleaveComponent,
    ManagernavbarComponent,
    LeaveComponent,
    MaternalLeaveComponent,
    PaternalLeaveComponent,
    MyrequestnavbarComponent,
    ReportsComponent,
    HrnavbarComponent
  ],
  exports: [
    CreateprofilenavbarComponent,
    PrimaryComponent,
    ProjectComponent,
    HealthComponent,
    NavbarComponent,
    SidebarComponent,
    ReportnavbarComponent,
    SkillsComponent,
    FileSelectDirective,
    WorkexpComponent,
    ProjecallocComponent,
    CreateprojectComponent,
    AllocatedeallocateprojComponent,
    ApprovetimesheetComponent,
    ApproveleaveComponent,
    ManagernavbarComponent,
    LeaveComponent,
    MaternalLeaveComponent,
    PaternalLeaveComponent,
    MyrequestnavbarComponent,
    ReportsComponent,
    HrnavbarComponent
  ],
  providers: [AuthGuardPrimary, NavbarService]
})
export class ComponentsModule {}
