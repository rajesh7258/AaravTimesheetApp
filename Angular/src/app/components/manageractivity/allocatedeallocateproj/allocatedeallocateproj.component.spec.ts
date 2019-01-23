import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatedeallocateprojComponent } from './allocatedeallocateproj.component';

describe('AllocatedeallocateprojComponent', () => {
  let component: AllocatedeallocateprojComponent;
  let fixture: ComponentFixture<AllocatedeallocateprojComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocatedeallocateprojComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocatedeallocateprojComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
