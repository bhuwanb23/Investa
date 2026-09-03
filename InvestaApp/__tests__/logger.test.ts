import logger from '../src/utils/logger';

describe('logger', () => {
  let debugSpy: jest.SpyInstance;
  let infoSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs debug messages with a [DEBUG] prefix', () => {
    logger.debug('test debug');
    expect(debugSpy).toHaveBeenCalledWith('[DEBUG] test debug');
  });

  it('forwards extra params to console.debug', () => {
    const extra = { key: 'value' };
    logger.debug('with extra', extra);
    expect(debugSpy).toHaveBeenCalledWith('[DEBUG] with extra', extra);
  });

  it('logs info messages with an [INFO] prefix', () => {
    logger.info('test info');
    expect(infoSpy).toHaveBeenCalledWith('[INFO] test info');
  });

  it('logs warn messages with a [WARN] prefix', () => {
    logger.warn('test warn');
    expect(warnSpy).toHaveBeenCalledWith('[WARN] test warn');
  });

  it('logs error messages with an [ERROR] prefix', () => {
    logger.error('test error');
    expect(errorSpy).toHaveBeenCalledWith('[ERROR] test error');
  });

  describe('apiError', () => {
    it('formats endpoint, status and detail from the error response', () => {
      const error = {
        response: { status: 404, data: { detail: 'Not found' } },
      };
      logger.apiError('/api/courses/', error);
      expect(errorSpy).toHaveBeenCalledWith(
        '[API ERROR] /api/courses/ (404): Not found'
      );
    });

    it('falls back to the error message when the response has no detail', () => {
      const error = { response: { status: 500 }, message: 'Network error' };
      logger.apiError('/api/trades/', error);
      expect(errorSpy).toHaveBeenCalledWith(
        '[API ERROR] /api/trades/ (500): Network error'
      );
    });

    it('handles errors without a response or message', () => {
      logger.apiError('/api/unknown/', {});
      expect(errorSpy).toHaveBeenCalledWith(
        '[API ERROR] /api/unknown/ (unknown): unknown error'
      );
    });
  });
});