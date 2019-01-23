import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovetimesheetComponent } from './approvetimesheet.component';

describe('ApprovetimesheetComponent', () => {
  let component: ApprovetimesheetComponent;
  let fixture: ComponentFixture<ApprovetimesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovetimesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovetimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
