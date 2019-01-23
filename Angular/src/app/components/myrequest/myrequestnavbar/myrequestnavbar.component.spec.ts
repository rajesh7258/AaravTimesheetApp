import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyrequestnavbarComponent } from './myrequestnavbar.component';

describe('MyrequestnavbarComponent', () => {
  let component: MyrequestnavbarComponent;
  let fixture: ComponentFixture<MyrequestnavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyrequestnavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyrequestnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
