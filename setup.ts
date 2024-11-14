jest.mock('../auth/auth-guard', () => ({
  JwtAuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}));

global.beforeEach(() => {
  jest.clearAllMocks();
});
