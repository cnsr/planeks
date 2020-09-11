from rest_framework import permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from .models import User


class LoginView(GenericAPIView):
    authentication_classes = []
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargst):
        username = request.data.get("username")
        password = request.data.get("password")
        user = User.objects.filter(username=username).first()
        if user is not None:
            if user.check_password(password):
                user.assign_token()
                token = Token.objects.get_or_create(user=user)[0].key
                return Response(
                    {
                        "token": token,
                        "username": user.username,
                    },
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"error": "Wrong password"}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
