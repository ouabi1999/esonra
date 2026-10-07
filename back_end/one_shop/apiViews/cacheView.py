from datetime import datetime, timezone

from django.http import HttpResponse, HttpResponseNotModified
from django.utils.http import http_date, parse_http_date_safe

# Example last-modified timestamp for this resource. Change as needed.
LAST_MODIFIED_DT = datetime(2025, 11, 23, 0, 0, tzinfo=timezone.utc)
LAST_MODIFIED_TS = int(LAST_MODIFIED_DT.timestamp())


def cached_resource(request):
    """Simple view demonstrating HTTP 304 Not Modified handling.

    - If the client sends `If-Modified-Since` and the timestamp is >= the
      resource's last-modified time, return `HttpResponseNotModified()` (304).
    - Otherwise return the content with a `Last-Modified` header.
    """
    ims = request.META.get("HTTP_IF_MODIFIED_SINCE")
    if ims:
        ims_ts = parse_http_date_safe(ims)
        if ims_ts is not None and ims_ts >= LAST_MODIFIED_TS:
            return HttpResponseNotModified()

    resp = HttpResponse("This is the resource content.\n", content_type="text/plain")
    resp["Last-Modified"] = http_date(LAST_MODIFIED_TS)
    resp["Cache-Control"] = "max-age=3600"
    return resp
