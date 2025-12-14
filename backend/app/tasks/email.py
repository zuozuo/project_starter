"""
Email related Celery tasks
"""
from app.core.celery_app import celery_app
from app.utils import generate_test_email, send_email


@celery_app.task(name="send_email_task")
def send_email_task(
    email_to: str,
    subject: str,
    html_content: str,
) -> dict[str, str]:
    """
    异步发送邮件任务

    Args:
        email_to: 收件人邮箱
        subject: 邮件主题
        html_content: HTML 邮件内容

    Returns:
        发送结果
    """
    send_email(
        email_to=email_to,
        subject=subject,
        html_content=html_content,
    )
    return {"status": "sent", "email": email_to}


@celery_app.task(name="send_test_email")
def send_test_email_task(email_to: str) -> dict[str, str]:
    """
    发送测试邮件

    Args:
        email_to: 收件人邮箱

    Returns:
        发送结果
    """
    email_data = generate_test_email(email_to=email_to)
    send_email(
        email_to=email_to,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return {"status": "sent", "email": email_to}
