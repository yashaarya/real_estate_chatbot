from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import QueryHistory
from .serializers import QueryHistorySerializer
from .ml_model import estimate_price

@api_view(['POST'])
def analyze_property(request):
    data = request.data
    area = data.get('area', 0)
    bedrooms = data.get('bedrooms', 0)
    location_factor = data.get('location_factor', 1)

    price = estimate_price(area, bedrooms, location_factor)

    message = f"Estimated property value: ₹{price:,}"
    result = {
        "estimated_price": price,
        "message": message
    }

    # optional: save to history
    try:
        QueryHistory.objects.create(
            question=f"Analyze: area={area}, bedrooms={bedrooms}, location_factor={location_factor}",
            response=message
        )
    except Exception:
        pass

    return Response(result)


@api_view(['POST'])
def chat(request):
    user_msg = request.data.get('message', '')
    user_msg_l = user_msg.lower() if isinstance(user_msg, str) else ''

    if 'price' in user_msg_l or 'estimate' in user_msg_l:
        bot_response = "To estimate price share area (sqft), number of bedrooms and a location factor (1-5)."
    elif 'hello' in user_msg_l or 'hi' in user_msg_l:
        bot_response = "Hello! I'm Pixel Perfect — tell me about the property (area, bedrooms, location)."
    else:
        bot_response = "I can help with property price estimates and simple analysis. Ask about price or area."

    # save conversation snippet
    try:
        QueryHistory.objects.create(question=user_msg, response=bot_response)
    except Exception:
        pass

    return Response({"reply": bot_response})
