import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectleaveComponent } from './rejectleave.component';

describe('RejectleaveComponent', () => {
  let component: RejectleaveComponent;
  let fixture: ComponentFixture<RejectleaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectleaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectleaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
