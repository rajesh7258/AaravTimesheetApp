import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateprofilenavbarComponent } from './createprofilenavbar.component';

describe('CreateprofilenavbarComponent', () => {
  let component: CreateprofilenavbarComponent;
  let fixture: ComponentFixture<CreateprofilenavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateprofilenavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateprofilenavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
