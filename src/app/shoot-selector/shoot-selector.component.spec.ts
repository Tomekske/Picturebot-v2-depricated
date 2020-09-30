import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShootSelectorComponent } from './shoot-selector.component';

describe('ShootSelectorComponent', () => {
  let component: ShootSelectorComponent;
  let fixture: ComponentFixture<ShootSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShootSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShootSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
