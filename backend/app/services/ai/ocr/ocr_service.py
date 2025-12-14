"""
OCR service for document text extraction
"""
from pathlib import Path

# TODO: 安装依赖后取消注释
# import pytesseract
# from PIL import Image
# from pdf2image import convert_from_path


class OCRService:
    """OCR 服务类"""

    def __init__(self, lang: str = "eng+chi_sim"):
        """
        初始化 OCR 服务

        Args:
            lang: OCR 语言 (默认英文+简体中文)
        """
        self.lang = lang

    def extract_text_from_image(self, image_path: str | Path) -> str:
        """
        从图片中提取文本

        Args:
            image_path: 图片路径

        Returns:
            提取的文本
        """
        # TODO: 实现图片 OCR
        # image = Image.open(image_path)
        # text = pytesseract.image_to_string(image, lang=self.lang)
        # return text
        raise NotImplementedError("请先安装 pytesseract 和 Pillow")

    def extract_text_from_pdf(self, pdf_path: str | Path) -> list[str]:
        """
        从 PDF 中提取文本 (通过 OCR)

        Args:
            pdf_path: PDF 文件路径

        Returns:
            每页提取的文本列表
        """
        # TODO: 实现 PDF OCR
        # images = convert_from_path(pdf_path)
        # texts = []
        # for image in images:
        #     text = pytesseract.image_to_string(image, lang=self.lang)
        #     texts.append(text)
        # return texts
        raise NotImplementedError("请先安装 pdf2image")

    def extract_structured_data(
        self, image_path: str | Path
    ) -> dict[str, str | list[str]]:
        """
        从图片中提取结构化数据 (例如表格)

        Args:
            image_path: 图片路径

        Returns:
            结构化数据字典
        """
        # TODO: 实现结构化数据提取
        # 可以使用 pytesseract 的表格识别功能
        # 或者集成其他专门的表格识别服务
        raise NotImplementedError("请先安装相关依赖")
