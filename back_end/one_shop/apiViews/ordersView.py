
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ..models import Orders
from ..serializer import OrderSerializer
from rest_framework.permissions import IsAuthenticated
from django.core.paginator import Paginator


class OrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk=None):
        current_page = int(request.data.get('current_page', 1))
        per_page = int(request.GET.get('per_page', 4))

        orders = Orders.objects.filter(user = pk)
        
        paginator = Paginator(orders, per_page)
        page = paginator.get_page(current_page)

        serializer = OrderSerializer(page.object_list, many=True)
      
             
        return Response({
            'orders': serializer.data,
            'total_orders': paginator.count,
            'total_pages': paginator.num_pages
            })
       

    
