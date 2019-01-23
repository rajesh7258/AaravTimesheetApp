import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportnavbarComponent } from './reportnavbar.component';

describe('ReportnavbarComponent', () => {
  let component: ReportnavbarComponent;
  let fixture: ComponentFixture<ReportnavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportnavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
