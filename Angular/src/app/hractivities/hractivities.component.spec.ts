import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HractivitiesComponent } from './hractivities.component';

describe('HractivitiesComponent', () => {
  let component: HractivitiesComponent;
  let fixture: ComponentFixture<HractivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HractivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HractivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
