# 🤖 C/C++ Assistant Chatbot

A **GPU-accelerated, locally-hosted** AI chatbot specialized for C/C++ programming assistance. Built with React and powered by Ollama for fast, private, and professional coding help.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- **🚀 GPU-Accelerated**: Optimized for NVIDIA RTX GPUs with CUDA
- **⚡ Real-time Streaming**: Token-by-token response generation  
- **🎯 C/C++ Specialized**: Custom-trained model for programming assistance
- **🔒 Privacy-First**: 100% local processing, no cloud dependencies
- **🎨 Professional UI**: GitHub-inspired code blocks with syntax highlighting
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🔧 Error Debugging**: Structured error analysis and solutions

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org))
- **Ollama** ([Download](https://ollama.ai))
- **NVIDIA GPU** with CUDA support (RTX 3050+ recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/baalaganeshr/chat.git
cd chat

# Install dependencies
npm install

# Setup the AI model
ollama pull qwen2.5-coder:3b
ollama create cc-assistant-superfast -f Modelfile

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚡ Performance Optimization

Run the optimization script for maximum speed:

```bash
.\superfast-gpu.ps1
```

## 📊 Performance Metrics

| Metric | Before | After | Improvement |
|--------|---------|-------|-------------|
| Response Time | 10-15s | 3-5s | **3-4x faster** |
| Model Size | 6.0 GB | 3.1 GB | **50% smaller** |
| GPU Usage | 46% | 63% | **Better utilization** |

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
