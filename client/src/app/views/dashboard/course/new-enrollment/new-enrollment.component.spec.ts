import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEnrollmentComponent } from './new-enrollment.component';

describe('NewEnrollmentComponent', () => {
  let component: NewEnrollmentComponent;
  let fixture: ComponentFixture<NewEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEnrollmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
