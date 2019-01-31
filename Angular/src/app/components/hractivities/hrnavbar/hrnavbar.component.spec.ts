import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrnavbarComponent } from './hrnavbar.component';

describe('HrnavbarComponent', () => {
  let component: HrnavbarComponent;
  let fixture: ComponentFixture<HrnavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrnavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
