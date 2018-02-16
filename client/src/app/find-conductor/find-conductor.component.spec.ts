import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindConductorComponent } from './find-conductor.component';

describe('FindConductorComponent', () => {
  let component: FindConductorComponent;
  let fixture: ComponentFixture<FindConductorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindConductorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindConductorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
