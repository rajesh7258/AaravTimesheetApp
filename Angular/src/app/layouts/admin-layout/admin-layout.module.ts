import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { ChartsModule } from "ng2-charts";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { MatDialogModule } from "@angular/material/dialog";
import { MatNativeDateModule } from "@angular/material";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { HttpModule } from "@angular/http";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { Ng2OrderModule } from "ng2-order-pipe";
import { NgxPaginationModule } from "ngx-pagination";
import { HttpClientModule } from "@angular/common/http";
import { Ng2FilterPipeModule } from "ng2-filter-pipe";
import { FilterPipe } from "./admin-layout.component";
import { Ng4LoadingSpinnerModule } from "ng4-loading-spinner";
import { NgxSpinnerModule } from "ngx-spinner";
import { CalendarModule } from "primeng/calendar";
import { AccordionModule } from "primeng/accordion";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from "@angular/material/table";
import {
  AtomSpinnerModule,
  FlowerSpinnerModule,
  IntersectingCirclesSpinnerModule,
  OrbitSpinnerModule,
  RadarSpinnerModule
} from "angular-epic-spinners";
import { ResponsiveModule } from "ngx-responsive";
import { ComponentsModule } from "../../components/components.module";
import { CreateCustomerComponent } from "../../create-customer/create-customer.component";
import { TimesheetComponent } from "../../timesheet/timesheet.component";
import { CreateCalenderComponent } from "../../create-calender/create-calender.component";
import { ViewHolidayComponent } from "../../view-holiday/view-holiday.component";
import { ViewProfileComponent } from "../../view-profile/view-profile.component";
import { ManageractivitesComponent } from "../../manageractivites/manageractivites.component";
import { AuthGuardPrimary } from "../../../app/providers/auth.guard";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { ViewtimesheetComponent } from "../../components/manageractivity/viewtimesheet/viewtimesheet.component";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { MyrequestsComponent } from "../../myrequests/myrequests.component";
import { ViewleavesComponent } from "../../components/myrequest/viewleaves/viewleaves.component";
import { RejectleaveComponent } from "../../components/manageractivity/rejectleave/rejectleave.component";
import { HractivitiesComponent } from "../../hractivities/hractivities.component";
const config = {
  breakPoints: {
    xs: { max: 600 },
    sm: { min: 601, max: 959 },
    md: { min: 960, max: 1279 },
    lg: { min: 1280, max: 1919 },
    xl: { min: 1920 }
  },
  debounceTime: 100
};

@NgModule({
  imports: [
    Ng2SearchPipeModule,
    Ng4LoadingSpinnerModule.forRoot(),
    ResponsiveModule.forRoot(config),
    NgxSpinnerModule,
    NgxPaginationModule,
    Ng2OrderModule,
    CommonModule,
    HttpClientModule,
    Ng2FilterPipeModule,
    ReactiveFormsModule,
    MatDialogModule,
    ComponentsModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpModule,
    ChartsModule,
    NgbModule,
    MatInputModule,
    ToastrModule.forRoot(),
    NgxChartsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatDatepickerModule,
    CalendarModule,
    AccordionModule,
    MatNativeDateModule,
    MatProgressBarModule,
    AtomSpinnerModule,
    FlowerSpinnerModule,
    IntersectingCirclesSpinnerModule,
    OrbitSpinnerModule,
    RadarSpinnerModule,
    MatExpansionModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    NgxLoadingModule.forRoot({}),
    MatTableModule
  ],
  declarations: [
    FilterPipe,
    CreateCustomerComponent,
    TimesheetComponent,
    CreateCalenderComponent,
    ViewHolidayComponent,
    ViewProfileComponent,
    ManageractivitesComponent,
    ViewtimesheetComponent,
    MyrequestsComponent,
    ViewleavesComponent,
    RejectleaveComponent,
    HractivitiesComponent
  ],
  providers: [AuthGuardPrimary],

  entryComponents: [
    ViewtimesheetComponent,
    ViewleavesComponent,
    RejectleaveComponent
  ]
})
export class AdminLayoutModule {}
