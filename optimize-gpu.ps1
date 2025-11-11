# Ollama GPU Optimization Script
# Run this before starting your chat application for optimal performance

# Set environment variables for better GPU utilization
$env:OLLAMA_NUM_PARALLEL = "1"
$env:OLLAMA_MAX_LOADED_MODELS = "1" 
$env:OLLAMA_FLASH_ATTENTION = "1"

# Preload the optimized model to GPU
Write-Host "🚀 Loading optimized CC Assistant model to GPU..."
ollama run cc-assistant-fast "Ready for C/C++ assistance!" | Out-Null

Write-Host "✅ GPU optimization complete!"
Write-Host "💡 Your RTX 3050 is now ready for fast AI responses!"

# Show current model status
Write-Host "`n📊 Current model status:"
ollama ps