import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdDashboard } from './rd-dashboard';

describe('RdDashboard', () => {
  let component: RdDashboard;
  let fixture: ComponentFixture<RdDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
