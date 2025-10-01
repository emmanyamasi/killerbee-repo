import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryDashboard } from './factory-dashboard';

describe('FactoryDashboard', () => {
  let component: FactoryDashboard;
  let fixture: ComponentFixture<FactoryDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoryDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactoryDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
