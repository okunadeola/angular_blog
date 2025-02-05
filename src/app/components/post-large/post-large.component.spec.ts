import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostLargeComponent } from './post-large.component';

describe('PostLargeComponent', () => {
  let component: PostLargeComponent;
  let fixture: ComponentFixture<PostLargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostLargeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostLargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
