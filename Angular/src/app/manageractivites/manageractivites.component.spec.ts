import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageractivitesComponent } from './manageractivites.component';

describe('ManageractivitesComponent', () => {
  let component: ManageractivitesComponent;
  let fixture: ComponentFixture<ManageractivitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageractivitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageractivitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
