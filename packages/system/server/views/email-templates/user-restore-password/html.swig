{% extends '../../layouts/email.html' %}

{% block content %}
    Hi {{user.username}}<br>
    We have received a request to reset the password for your account.<br>
    If you made this request, please click on the link below or paste this into your browser to complete the process:<br>
    <a href="http://{{baseUrl}}/auth/reset-password/{{user.resetPasswordToken}}">http://{{baseUrl}}/auth/reset-password/{{user.resetPasswordToken}}</a>,<br>
    This link will work for 2 days or until your password is reset.<br>
    If you did not ask to change your password, please ignore this email and your account will remain unchanged.
{% endblock %}