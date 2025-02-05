import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostMdComponent } from './post-md.component';

describe('PostMdComponent', () => {
  let component: PostMdComponent;
  let fixture: ComponentFixture<PostMdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostMdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostMdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
