"""
Vector store service using Qdrant
"""
from typing import Any

from app.core.config import settings

# TODO: 安装依赖后取消注释
# from qdrant_client import QdrantClient
# from qdrant_client.models import Distance, VectorParams
# from langchain.vectorstores import Qdrant


class VectorStore:
    """向量数据库服务"""

    def __init__(self):
        """初始化 Qdrant 客户端"""
        self.qdrant_url = settings.QDRANT_URL
        # TODO: 取消注释
        # self.client = QdrantClient(url=self.qdrant_url)

    def create_collection(
        self,
        collection_name: str,
        vector_size: int = 384,
        distance: str = "Cosine",
    ) -> None:
        """
        创建向量集合

        Args:
            collection_name: 集合名称
            vector_size: 向量维度 (默认 384 for sentence-transformers)
            distance: 距离度量方式
        """
        # TODO: 实现集合创建
        # self.client.create_collection(
        #     collection_name=collection_name,
        #     vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
        # )
        raise NotImplementedError("请先安装 qdrant-client")

    def add_documents(
        self,
        collection_name: str,
        documents: list[dict[str, Any]],
        embeddings: list[list[float]],
    ) -> None:
        """
        添加文档向量

        Args:
            collection_name: 集合名称
            documents: 文档列表
            embeddings: 文档向量列表
        """
        # TODO: 实现文档添加
        raise NotImplementedError("请先安装 qdrant-client")

    def search(
        self,
        collection_name: str,
        query_vector: list[float],
        limit: int = 5,
    ) -> list[dict[str, Any]]:
        """
        向量相似度搜索

        Args:
            collection_name: 集合名称
            query_vector: 查询向量
            limit: 返回结果数量

        Returns:
            搜索结果列表
        """
        # TODO: 实现向量搜索
        # results = self.client.search(
        #     collection_name=collection_name,
        #     query_vector=query_vector,
        #     limit=limit,
        # )
        # return results
        raise NotImplementedError("请先安装 qdrant-client")

    def delete_collection(self, collection_name: str) -> None:
        """
        删除集合

        Args:
            collection_name: 集合名称
        """
        # TODO: 实现集合删除
        # self.client.delete_collection(collection_name=collection_name)
        raise NotImplementedError("请先安装 qdrant-client")
