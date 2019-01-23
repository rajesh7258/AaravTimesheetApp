import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveleaveComponent } from './approveleave.component';

describe('ApproveleaveComponent', () => {
  let component: ApproveleaveComponent;
  let fixture: ComponentFixture<ApproveleaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveleaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveleaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
