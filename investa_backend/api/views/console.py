from django.shortcuts import render
from django.db import connection
from django.apps import apps


def _build_model_entries():
    """Collect metadata and up to 50 rows for all models to display in the DB explorer."""
    model_entries = []
    try:
        from django.apps import apps
        from django.db import connection

        # Existing tables in DB
        try:
            existing_tables = set(connection.introspection.table_names())
        except Exception as e:
            print(f"Error getting table names: {e}")
            existing_tables = set()

        # All models across installed apps
        all_models = []
        for app_config in apps.get_app_configs():
            try:
                app_models = app_config.get_models()
                all_models.extend(app_models)
            except Exception as e:
                print(f"Error getting models from {app_config.name}: {e}")
                continue

        # Ensure our local models are present
        from ..models import Language, UserProfile, SecuritySettings, PrivacySettings, LearningProgress, TradingPerformance, UserSession, Notification, Badge, UserBadge
        custom_models = [Language, UserProfile, SecuritySettings, PrivacySettings, LearningProgress, TradingPerformance, UserSession, Notification, Badge, UserBadge]
        all_models.extend(custom_models)

        # Dedupe while keeping order
        seen = set()
        unique_models = []
        for model in all_models:
            if model not in seen:
                seen.add(model)
                unique_models.append(model)

        for model in unique_models:
            try:
                if not getattr(model._meta, 'managed', True):
                    continue

                app_label = model._meta.app_label
                model_name = model.__name__
                table_name = model._meta.db_table

                fields = [field.name for field in model._meta.fields]
                has_table = table_name in existing_tables

                try:
                    if has_table:
                        queryset = model.objects.all()
                        raw_rows = list(queryset.values(*fields)[:50])
                        rows = [[row.get(field) for field in fields] for row in raw_rows]
                        total_count = queryset.count()
                    else:
                        rows = []
                        total_count = 0

                    model_entries.append({
                        'app_label': app_label,
                        'model_name': model_name,
                        'table_name': table_name,
                        'fields': fields,
                        'rows': rows,
                        'total_count': total_count,
                        'has_table': has_table,
                    })

                except Exception as e:
                    print(f"Error querying model {model_name}: {e}")
                    model_entries.append({
                        'app_label': app_label,
                        'model_name': model_name,
                        'table_name': table_name,
                        'fields': fields,
                        'rows': [],
                        'total_count': 0,
                        'has_table': has_table,
                    })

            except Exception as e:
                print(f"Error processing model {model}: {e}")
                continue

        model_entries.sort(key=lambda m: (m['app_label'], m['model_name']))
        print(f"Found {len(model_entries)} models for DB explorer")
    except Exception as e:
        print(f"Error building model entries: {e}")
        model_entries = []

    return model_entries


def index(request):
    """Landing page for the console"""
    return render(request, 'index.html')


def dashboard(request):
    """Development dashboard to try API calls quickly"""
    return render(request, 'dashboard.html', {'models': _build_model_entries()})


def database_view(request):
    """Render a page that shows all tables and sample contents"""
    model_entries = _build_model_entries()
    return render(request, 'database.html', {'models': model_entries})
