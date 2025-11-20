from django.contrib import admin
from .models import QueryHistory

@admin.register(QueryHistory)
class QueryHistoryAdmin(admin.ModelAdmin):
    list_display = ('question', 'created_at')
