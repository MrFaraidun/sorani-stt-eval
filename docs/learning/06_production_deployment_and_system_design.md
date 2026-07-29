# Learning Module 06: Production System Design & Deployment Engineering

> **Sub-Plan Reference:** Sub-Plan 06 — Production FastAPI Service, Containerization & Final Deliverables  
> **Target Mastery:** ASGI Event Loops, Threadpool Offloading for Heavy ML Models, GPU Memory Management, ONNX/TensorRT Quantization, and Production Observability.

---

## 1. Async ASGI Web Servers & Heavy ML Inference

### 1.1 The Event Loop Blocking Problem
FastAPI runs on an asynchronous ASGI event loop (uvicorn/starlette). In Python, an `async def` route runs directly on the single-threaded event loop. If a route executes CPU- or GPU-bound synchronous PyTorch model inference directly inside `async def`:

```python
# ❌ DANGEROUS: Blocks the entire asyncio event loop for all users!
@app.post("/transcribe")
async def transcribe(file: UploadFile):
    result = whisper_model.generate(...) # BLOCKS EVENT LOOP for 5 seconds!
    return result
```

While PyTorch executes matrix multiplications, no other incoming HTTP request (e.g. `/health`, `/metrics`) can be processed by the server!

### 1.2 The Threadpool Delegation Solution
Heavy synchronous ML inference must be offloaded to an asynchronous worker threadpool via `run_in_threadpool`:

```python
# ✅ PRODUCTION SAFE: Offloads blocking PyTorch inference to worker threadpool
from fastapi.concurrency import run_in_threadpool

@app.post("/transcribe")
async def transcribe(file: UploadFile):
    result = await run_in_threadpool(whisper_service.transcribe, audio_path)
    return result
```

---

## 2. GPU VRAM Memory Caching & Singleton Model Registries

### 2.1 Why Loading Models Per Request Fails
Loading a 1.5 Billion parameter model (like Whisper Large-v3) takes $\approx 4\text{--}8\text{ seconds}$ to read model weights from disk to GPU VRAM. Instantiating models inside request handlers leads to server crash (OOM) or extreme request latency.

### 2.2 Thread-Safe Singleton Registry
The `ModelRegistry` uses a Threading Read/Write Lock (`threading.RLock`) to lazily load and retain model weights in GPU VRAM as cached singletons across requests.

---

## 3. Production Latency & Quantization Strategies

| Optimization Technique | Description | Throughput Gain | Latency Reduction |
|---|---|---|---|
| **FP16 / BF16 Mixed Precision** | Casts weights from FP32 to 16-bit floating point | $2\times$ | $\approx 40\%$ |
| **INT8 Quantization** | Quantizes linear layers to 8-bit integers (bitsandbytes / ONNX) | $3.5\times$ | $\approx 60\%$ |
| **TensorRT-LLM / TensorRT-Speech** | Fuses attention kernels and optimizes CUDA memory layouts | $4\times\text{--}6\times$ | $\approx 75\%$ |
| **Speculative Decoding** | Uses a small draft model (Whisper-tiny) to draft tokens verified by Whisper-large | $2.5\times$ | $\approx 50\%$ |
