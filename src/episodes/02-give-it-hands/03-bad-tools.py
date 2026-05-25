"""
Episode 2, sample 3 — three tools that confuse the model, and why.

Each pair below is a "bad" tool and a "fixed" tool. They look the same
from a code-review perspective. The model treats them very differently.

This file is for reading more than running, but the fixed versions
are usable.
"""


# ---------------------------------------------------------------------------
# Failure 1: overlapping responsibilities
# Two tools that could each plausibly answer the same question. The model
# flips between them or calls both and has to reconcile.
# ---------------------------------------------------------------------------

BAD_LOOKUP_PLACE = {
    "name": "lookup_place",
    "description": "Find information about a place.",
    "input_schema": {
        "type": "object",
        "properties": {"name": {"type": "string"}},
        "required": ["name"],
    },
}

BAD_GET_CITY_INFO = {
    "name": "get_city_info",
    "description": "Get information about a city.",
    "input_schema": {
        "type": "object",
        "properties": {"city": {"type": "string"}},
        "required": ["city"],
    },
}

# Fix: delete one. Or merge them. A single well-scoped tool beats two
# overlapping ones every time.

FIXED_GET_PLACE = {
    "name": "get_place_info",
    "description": (
        "Look up reference info about a city, town, or landmark: country, "
        "time zone, population, brief description. Use this when the user "
        "asks about a destination or you need basic facts before planning."
    ),
    "input_schema": {
        "type": "object",
        "properties": {"name": {"type": "string", "description": "City, town, or landmark name."}},
        "required": ["name"],
    },
}


# ---------------------------------------------------------------------------
# Failure 2: parameters the model has to invent
# `deal_tier` has no constraints. The model will pass whatever string it
# thinks fits. Sometimes "budget", sometimes "low", sometimes "$".
# ---------------------------------------------------------------------------

BAD_GET_HOTEL_DEALS = {
    "name": "get_hotel_deals",
    "description": "Find hotel deals in a city.",
    "input_schema": {
        "type": "object",
        "properties": {
            "city": {"type": "string"},
            "deal_tier": {"type": "string"},
        },
        "required": ["city", "deal_tier"],
    },
}

# Fix: constrain with an enum and explain each value.

FIXED_GET_HOTEL_DEALS = {
    "name": "get_hotel_deals",
    "description": (
        "Find hotel deals in a city, filtered by price tier. "
        "Use when the user asks for hotels and a rough budget is known."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "city": {"type": "string", "description": "City name."},
            "deal_tier": {
                "type": "string",
                "enum": ["budget", "midrange", "luxury"],
                "description": (
                    "Price tier. budget: under $100/night. "
                    "midrange: $100–300. luxury: $300+."
                ),
            },
        },
        "required": ["city", "deal_tier"],
    },
}


# ---------------------------------------------------------------------------
# Failure 3: tools that don't fail loudly
# Returning [] on error tells the model "there are zero results" — which
# is a confident lie. The model will plan around the lie.
# ---------------------------------------------------------------------------

def bad_search_flights(origin: str, destination: str, date: str) -> list:
    try:
        return _real_search(origin, destination, date)  # noqa: F821 (illustrative)
    except Exception:
        return []  # ← the model now believes there are no flights


def fixed_search_flights(origin: str, destination: str, date: str) -> dict:
    """Return a uniform shape. On failure the model can see what broke."""
    try:
        flights = _real_search(origin, destination, date)  # noqa: F821 (illustrative)
        return {"ok": True, "data": flights}
    except Exception as e:
        return {
            "ok": False,
            "error": f"{type(e).__name__}: {e}",
            "hint": "Try again, or ask the user to relax one constraint.",
        }


# ---------------------------------------------------------------------------
# A reading exercise:
# Look at BAD_LOOKUP_PLACE and BAD_GET_CITY_INFO. Imagine you are the
# model. The user just asked "what time zone is Tokyo in?" Which tool
# do you call? Why? Now read the FIXED version and notice that the
# question doesn't even arise.
# ---------------------------------------------------------------------------
