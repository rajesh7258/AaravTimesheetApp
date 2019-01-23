import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjecallocComponent } from './projecalloc.component';

describe('ProjecallocComponent', () => {
  let component: ProjecallocComponent;
  let fixture: ComponentFixture<ProjecallocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjecallocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjecallocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
