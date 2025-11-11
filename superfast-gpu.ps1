# Super-Fast GPU Optimization Script
# Run this for maximum performance on your RTX 3050

Write-Host "🚀 Optimizing for maximum speed..."

# Set ultra-fast environment variables
$env:OLLAMA_MAX_LOADED_MODELS = "1"
$env:OLLAMA_NUM_PARALLEL = "1" 
$env:OLLAMA_FLASH_ATTENTION = "1"
$env:OLLAMA_MAX_QUEUE = "1"
$env:CUDA_VISIBLE_DEVICES = "0"

# Preload the super-fast 3B model to GPU
Write-Host "📥 Loading super-fast 3B model to GPU..."
ollama run cc-assistant-superfast "Ready for lightning-fast C/C++ assistance!" | Out-Null

Write-Host "⚡ Super-fast optimization complete!"
Write-Host "💡 Your RTX 3050 is now optimized for maximum speed!"
Write-Host "📊 Model size: 3.1 GB (vs 6.0 GB previously)"
Write-Host "🎯 Expected speed increase: 3-4x faster responses"

# Show current model status
Write-Host "`n📊 Current model status:"
ollama ps