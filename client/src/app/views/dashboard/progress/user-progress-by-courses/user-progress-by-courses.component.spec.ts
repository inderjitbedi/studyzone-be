import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProgressByCoursesComponent } from './user-progress-by-courses.component';

describe('UserProgressByCoursesComponent', () => {
  let component: UserProgressByCoursesComponent;
  let fixture: ComponentFixture<UserProgressByCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProgressByCoursesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProgressByCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
