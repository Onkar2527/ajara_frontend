import { TestBed } from '@angular/core/testing';

import { OvdService } from './ovd.service';

describe('OvdService', () => {
  let service: OvdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OvdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
