import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaternalLeaveComponent } from './maternal-leave.component';

describe('MaternalLeaveComponent', () => {
  let component: MaternalLeaveComponent;
  let fixture: ComponentFixture<MaternalLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaternalLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaternalLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
