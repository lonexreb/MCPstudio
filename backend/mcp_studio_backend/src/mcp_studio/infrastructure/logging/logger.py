# File: src/mcp_studio/infrastructure/logging/logger.py
import logging
import os
from datetime import datetime
from typing import Optional


class Logger:
    """Logger for application logging."""
    
    def __init__(self, log_level: str = "INFO"):
        """Initialize logger with specified log level."""
        self.log_level = getattr(logging, log_level)
        self.logger = logging.getLogger("mcp_studio")
        self.logger.setLevel(self.log_level)
        
        # Configure console handler if not already configured
        if not self.logger.handlers:
            console_handler = logging.StreamHandler()
            console_handler.setLevel(self.log_level)
            formatter = logging.Formatter(
                "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            )
            console_handler.setFormatter(formatter)
            self.logger.addHandler(console_handler)
    
    def get_logger(self) -> logging.Logger:
        """Get the configured logger."""
        return self.logger
    
    def info(self, message: str) -> None:
        """Log an info message."""
        self.logger.info(message)
    
    def error(self, message: str, exc: Optional[Exception] = None) -> None:
        """Log an error message with optional exception."""
        if exc:
            self.logger.error(f"{message}: {exc}", exc_info=True)
        else:
            self.logger.error(message)
    
    def warning(self, message: str) -> None:
        """Log a warning message."""
        self.logger.warning(message)
    
    def debug(self, message: str) -> None:
        """Log a debug message."""
        self.logger.debug(message)
    
    def setup_file_logging(self, log_dir: str = "logs") -> None:
        """Set up file logging."""
        # Create logs directory if it doesn't exist
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)
        
        # Create file handler
        log_file = os.path.join(
            log_dir, 
            f"mcp_studio_{datetime.now().strftime('%Y-%m-%d')}.log"
        )
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(self.log_level)
        
        # Create formatter
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        file_handler.setFormatter(formatter)
        
        # Add handler to logger
        self.logger.addHandler(file_handler)