import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { credentialsInterceptor } from './credentials.interceptor';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([credentialsInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('obtains the CSRF token before logging in and stores the authenticated user', () => {
    let usuario: { username: string } | undefined;

    service.login('admin', 'senha').subscribe((resultado) => {
      usuario = resultado;
    });

    const csrfRequest = httpTestingController.expectOne('/api/auth/csrf');
    expect(csrfRequest.request.method).toBe('GET');
    expect(csrfRequest.request.withCredentials).toBe(true);
    csrfRequest.flush({ headerName: 'X-XSRF-TOKEN', token: 'csrf-token' });

    const loginRequest = httpTestingController.expectOne('/api/auth/login');
    expect(loginRequest.request.method).toBe('POST');
    expect(loginRequest.request.withCredentials).toBe(true);
    expect(loginRequest.request.headers.get('X-XSRF-TOKEN')).toBe('csrf-token');
    expect(loginRequest.request.body).toEqual({ username: 'admin', password: 'senha' });
    loginRequest.flush({ username: 'admin', papeis: ['ROLE_ADMIN'] });

    const refreshedCsrfRequest = httpTestingController.expectOne('/api/auth/csrf');
    refreshedCsrfRequest.flush({ headerName: 'X-XSRF-TOKEN', token: 'refreshed-csrf-token' });

    expect(usuario).toEqual({ username: 'admin', papeis: ['ROLE_ADMIN'] });
    expect(service.usuario()).toEqual({ username: 'admin', papeis: ['ROLE_ADMIN'] });
  });

  it('sends the CSRF token when logging out', () => {
    service.logout().subscribe();

    const csrfRequest = httpTestingController.expectOne('/api/auth/csrf');
    csrfRequest.flush({ headerName: 'X-XSRF-TOKEN', token: 'logout-csrf-token' });

    const logoutRequest = httpTestingController.expectOne('/api/auth/logout');
    expect(logoutRequest.request.method).toBe('POST');
    expect(logoutRequest.request.withCredentials).toBe(true);
    expect(logoutRequest.request.headers.get('X-XSRF-TOKEN')).toBe('logout-csrf-token');
    logoutRequest.flush(null);

    expect(service.usuario()).toBeNull();
  });

  it('adds a CSRF token to other state-changing requests', () => {
    http.post('/api/adocoes', {}).subscribe();

    const csrfRequest = httpTestingController.expectOne('/api/auth/csrf');
    csrfRequest.flush({ headerName: 'X-XSRF-TOKEN', token: 'form-csrf-token' });

    const createRequest = httpTestingController.expectOne('/api/adocoes');
    expect(createRequest.request.withCredentials).toBe(true);
    expect(createRequest.request.headers.get('X-XSRF-TOKEN')).toBe('form-csrf-token');
    createRequest.flush(null);
  });
});
