{% extends '../../layouts/mail.html' %}

{% block content %}
    Hi {{user.name}}<br>
    We have received a request to reset the password for your account.<br>
    If you made this request, please click on the link below or paste this into your browser to complete the process:<br>
    <a href="http://{{hostname}}/#!/auth/reset/{{user.resetPasswordToken}}">http://{{hostname}}/#!/auth/reset/{{user.resetPasswordToken}}</a>,<br>
    This link will work for 1 hour or until your password is reset.<br>
    If you did not ask to change your password, please ignore this email and your account will remain unchanged.
{% endblock %}