import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEnrollmentRequestsComponent } from './manage-enrollment-requests.component';

describe('ManageEnrollmentRequestsComponent', () => {
  let component: ManageEnrollmentRequestsComponent;
  let fixture: ComponentFixture<ManageEnrollmentRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEnrollmentRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEnrollmentRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
