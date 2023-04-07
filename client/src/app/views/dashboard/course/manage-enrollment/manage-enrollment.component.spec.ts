import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEnrollmentComponent } from './manage-enrollment.component';

describe('ManageEnrollmentComponent', () => {
  let component: ManageEnrollmentComponent;
  let fixture: ComponentFixture<ManageEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEnrollmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
