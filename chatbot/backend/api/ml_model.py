# Simple ML placeholder for price estimation (option 1: Simple ML)
# This module provides a lightweight function you can call from views.

def estimate_price(area, bedrooms, location_factor):
    # Very simple heuristic-based estimator:
    # base per sqft price, bedroom boost and location multiplier
    try:
        area = float(area)
    except:
        area = 0.0
    try:
        bedrooms = int(bedrooms)
    except:
        bedrooms = 0
    try:
        location_factor = float(location_factor)
    except:
        location_factor = 1.0

    base_per_sqft = 5200  # example value (INR)
    base = area * base_per_sqft
    bedroom_boost = bedrooms * 150000
    loc_multiplier = 1 + (location_factor - 1) * 0.2

    estimated = (base + bedroom_boost) * loc_multiplier
    return round(estimated, 2)
