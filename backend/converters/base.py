from abc import ABC, abstractmethod
from pathlib import Path


class BaseConverter(ABC):
    @abstractmethod
    async def convert(
        self, input_path: Path, output_format: str, options: dict
    ) -> Path:
        """Convert file and return path to output file."""
        ...

    @abstractmethod
    def supported_input_formats(self) -> list[str]:
        ...

    @abstractmethod
    def supported_output_formats(self) -> list[str]:
        ...
