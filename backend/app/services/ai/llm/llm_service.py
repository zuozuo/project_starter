"""
LLM service for AI tutor functionality
"""
from typing import AsyncGenerator

from app.core.config import settings

# TODO: 安装依赖后取消注释
# from langchain_openai import ChatOpenAI
# from langchain_anthropic import ChatAnthropic


class LLMService:
    """LLM 服务类"""

    def __init__(self, provider: str = "openai", model: str = "gpt-4"):
        """
        初始化 LLM 服务

        Args:
            provider: LLM 提供商 (openai/anthropic)
            model: 模型名称
        """
        self.provider = provider
        self.model = model

        # TODO: 取消注释并实现
        # if provider == "openai":
        #     self.llm = ChatOpenAI(
        #         api_key=settings.OPENAI_API_KEY,
        #         model=model,
        #         temperature=0.7,
        #     )
        # elif provider == "anthropic":
        #     self.llm = ChatAnthropic(
        #         api_key=settings.ANTHROPIC_API_KEY,
        #         model=model,
        #         temperature=0.7,
        #     )

    async def generate(
        self,
        prompt: str,
        system_message: str | None = None,
    ) -> str:
        """
        生成 AI 回复

        Args:
            prompt: 用户提示词
            system_message: 系统提示词

        Returns:
            AI 生成的回复
        """
        # TODO: 实现 LLM 调用
        raise NotImplementedError("请先安装 langchain 和相关依赖")

    async def generate_stream(
        self,
        prompt: str,
        system_message: str | None = None,
    ) -> AsyncGenerator[str, None]:
        """
        流式生成 AI 回复

        Args:
            prompt: 用户提示词
            system_message: 系统提示词

        Yields:
            AI 生成的文本片段
        """
        # TODO: 实现流式 LLM 调用
        raise NotImplementedError("请先安装 langchain 和相关依赖")
        yield ""  # type: ignore

    async def generate_with_rag(
        self,
        query: str,
        context_documents: list[str],
        system_message: str | None = None,
    ) -> str:
        """
        使用 RAG 上下文生成回复

        Args:
            query: 用户查询
            context_documents: RAG 检索的上下文文档
            system_message: 系统提示词

        Returns:
            AI 生成的回复
        """
        # 构建包含上下文的提示词
        context = "\n\n".join(context_documents)
        prompt = f"""基于以下上下文回答问题:

上下文:
{context}

问题: {query}

回答:"""

        return await self.generate(prompt, system_message)
