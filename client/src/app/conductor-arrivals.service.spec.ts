import { TestBed, inject } from '@angular/core/testing';

import { ConductorArrivalsService } from './conductor-arrivals.service';

describe('ConductorArrivalsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConductorArrivalsService]
    });
  });

  it('should be created', inject([ConductorArrivalsService], (service: ConductorArrivalsService) => {
    expect(service).toBeTruthy();
  }));
});
