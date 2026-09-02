from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger('api')


def custom_exception_handler(exc, context):
    """
    Custom exception handler that returns consistent error format:
    {
        "error": True,
        "status_code": 4xx/5xx,
        "detail": "Human-readable message",
        "errors": { ... }  # field-level errors if applicable
    }
    """
    response = exception_handler(exc, context)

    if response is not None:
        error_data = {
            'error': True,
            'status_code': response.status_code,
        }

        # Standardize the detail field
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                error_data['detail'] = str(response.data['detail'])
            else:
                error_data['detail'] = 'Validation failed'
                error_data['errors'] = response.data
        elif isinstance(response.data, list):
            error_data['detail'] = ' '.join(str(d) for d in response.data)
        else:
            error_data['detail'] = str(response.data)

        response.data = error_data
    else:
        # Unhandled exception (500 error)
        logger.exception('Unhandled exception: %s', exc)
        response = Response(
            {
                'error': True,
                'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
                'detail': 'An internal server error occurred.',
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return response
