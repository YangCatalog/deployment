import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAgGridComponent } from './app-ag-grid.component';

describe('KfmAgGridComponent', () => {
  let component: AppAgGridComponent;
  let fixture: ComponentFixture<AppAgGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAgGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
