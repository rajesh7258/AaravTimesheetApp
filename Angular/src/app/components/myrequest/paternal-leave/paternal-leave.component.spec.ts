import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaternalLeaveComponent } from './paternal-leave.component';

describe('PaternalLeaveComponent', () => {
  let component: PaternalLeaveComponent;
  let fixture: ComponentFixture<PaternalLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaternalLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaternalLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
