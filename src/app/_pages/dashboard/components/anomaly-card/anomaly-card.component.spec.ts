import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnomalyCardComponent } from './anomaly-card.component';

describe('AnomalyCardComponent', () => {
  let component: AnomalyCardComponent;
  let fixture: ComponentFixture<AnomalyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnomalyCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnomalyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
