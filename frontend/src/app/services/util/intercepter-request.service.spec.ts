import { TestBed } from '@angular/core/testing';

import { IntercepterRequestService } from './intercepter-request.service';

describe('IntercepterRequestService', () => {
  let service: IntercepterRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntercepterRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
