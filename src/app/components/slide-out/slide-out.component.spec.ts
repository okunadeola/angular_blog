import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideOutComponent } from './slide-out.component';

describe('SlideOutComponent', () => {
  let component: SlideOutComponent;
  let fixture: ComponentFixture<SlideOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideOutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
