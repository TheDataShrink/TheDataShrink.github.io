"""
Episode 2, sample 1 — defining a tool.

A tool is a normal Python function plus a JSON schema that describes it
to the model. Both are needed: the function does the work, the schema
tells the model what it does and when to reach for it.

This file is imported by 02-tool-loop.py.
"""


def get_weather(city: str, date: str) -> dict:
    """Look up the forecast for a city on a date. Pretend this calls an API."""
    # In a real app this would hit a weather API. The shape of the return
    # matters more than the data — pick a shape and stick to it.
    return {
        "ok": True,
        "data": {
            "city": city,
            "date": date,
            "high_c": 14,
            "low_c": 7,
            "summary": "light rain",
        },
    }


WEATHER_TOOL = {
    "name": "get_weather",
    "description": (
        "Look up the weather forecast for a given city and date. "
        "Use this whenever a plan depends on weather: outdoor activities, "
        "what to pack, deciding between indoor and outdoor options."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "city": {
                "type": "string",
                "description": "City name, e.g. 'Tokyo'.",
            },
            "date": {
                "type": "string",
                "description": "ISO date (YYYY-MM-DD) or natural phrase like 'next Tuesday'.",
            },
        },
        "required": ["city", "date"],
    },
}


# A second tool, kept here so 02-tool-loop.py has two to choose from.
def search_hotels(city: str, max_price_usd: int) -> dict:
    """Pretend hotel search. Returns a small list of options."""
    return {
        "ok": True,
        "data": [
            {"name": "Hotel Sakura", "price_usd": 180, "rating": 4.2},
            {"name": "Capsule Inn",  "price_usd":  60, "rating": 3.9},
            {"name": "Imperial",     "price_usd": 420, "rating": 4.8},
        ],
    }


HOTELS_TOOL = {
    "name": "search_hotels",
    "description": (
        "Search hotel options in a city under a maximum per-night price (USD). "
        "Use this when the user needs lodging and a budget is known."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "city": {"type": "string", "description": "City name."},
            "max_price_usd": {
                "type": "integer",
                "description": "Maximum nightly price in USD.",
            },
        },
        "required": ["city", "max_price_usd"],
    },
}
