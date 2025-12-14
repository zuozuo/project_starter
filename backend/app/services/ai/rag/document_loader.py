"""
Document loading service for RAG
"""
from pathlib import Path
from typing import Any

# TODO: 安装依赖后取消注释
# from langchain.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader
# from langchain.text_splitter import RecursiveCharacterTextSplitter


class DocumentLoader:
    """文档加载器"""

    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        """
        初始化文档加载器

        Args:
            chunk_size: 文档分块大小
            chunk_overlap: 分块重叠大小
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        # TODO: 取消注释
        # self.text_splitter = RecursiveCharacterTextSplitter(
        #     chunk_size=chunk_size,
        #     chunk_overlap=chunk_overlap,
        # )

    def load_pdf(self, file_path: str | Path) -> list[dict[str, Any]]:
        """
        加载 PDF 文档

        Args:
            file_path: PDF 文件路径

        Returns:
            文档块列表
        """
        # TODO: 实现 PDF 加载
        # loader = PyPDFLoader(str(file_path))
        # documents = loader.load()
        # chunks = self.text_splitter.split_documents(documents)
        # return chunks
        raise NotImplementedError("请先安装 langchain 和相关依赖")

    def load_text(self, file_path: str | Path) -> list[dict[str, Any]]:
        """
        加载文本文档

        Args:
            file_path: 文本文件路径

        Returns:
            文档块列表
        """
        # TODO: 实现文本加载
        raise NotImplementedError("请先安装 langchain 和相关依赖")

    def load_docx(self, file_path: str | Path) -> list[dict[str, Any]]:
        """
        加载 Word 文档

        Args:
            file_path: Word 文件路径

        Returns:
            文档块列表
        """
        # TODO: 实现 Word 加载
        raise NotImplementedError("请先安装 langchain 和相关依赖")
