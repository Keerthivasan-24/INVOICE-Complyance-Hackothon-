import os

class PipelineConfig:
    DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1")
    MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

config = PipelineConfig()
