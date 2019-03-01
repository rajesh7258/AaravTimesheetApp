import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackasssetsComponent } from './trackasssets.component';

describe('TrackasssetsComponent', () => {
  let component: TrackasssetsComponent;
  let fixture: ComponentFixture<TrackasssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackasssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackasssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
