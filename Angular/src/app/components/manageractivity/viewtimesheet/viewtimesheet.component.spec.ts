import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewtimesheetComponent } from './viewtimesheet.component';

describe('ViewtimesheetComponent', () => {
  let component: ViewtimesheetComponent;
  let fixture: ComponentFixture<ViewtimesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewtimesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewtimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
