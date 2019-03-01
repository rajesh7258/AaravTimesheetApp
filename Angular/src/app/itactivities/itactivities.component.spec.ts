import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItactivitiesComponent } from './itactivities.component';

describe('ItactivitiesComponent', () => {
  let component: ItactivitiesComponent;
  let fixture: ComponentFixture<ItactivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItactivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItactivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
