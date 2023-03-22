import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideFormComponent } from './slide-form.component';

describe('SlideFormComponent', () => {
  let component: SlideFormComponent;
  let fixture: ComponentFixture<SlideFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlideFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
