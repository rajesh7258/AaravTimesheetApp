import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItnavbarComponent } from './itnavbar.component';

describe('ItnavbarComponent', () => {
  let component: ItnavbarComponent;
  let fixture: ComponentFixture<ItnavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItnavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
