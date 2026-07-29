"""
Agent configuration for Kurdish Voice Commander.
Defines which ASR model, LLM model, and safety settings to use.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env", override=True)

# ─── ASR Configuration ──────────────────────────────────────────────────────
# Use Custom LoRA model for speed (~1-2s). Set to "hybrid" for more accuracy (~3-5s).
ASR_MODE = os.getenv("AGENT_ASR_MODE", "custom")  # "custom" or "hybrid"
ASR_DEVICE = "cuda"

# ─── NVIDIA NIM LLM Configuration ───────────────────────────────────────────
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "")
NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
NVIDIA_MODEL = os.getenv(
    "AGENT_LLM_MODEL",
    "nvidia/llama-3.1-nemotron-70b-instruct",
)

# ─── Microphone Configuration ───────────────────────────────────────────────
SAMPLE_RATE = 16_000       # 16 kHz mono (required by Whisper / VAD)
CHANNELS = 1
SILENCE_THRESHOLD_SEC = 1.5  # Seconds of silence before we stop recording
VAD_THRESHOLD = 0.5          # Silero VAD speech probability threshold

# ─── Executor Safety Configuration ──────────────────────────────────────────
COMMAND_TIMEOUT_SEC = 30

# Commands that ALWAYS require explicit y/n confirmation before running.
DANGEROUS_PREFIXES = [
    "rm ",
    "rm -",
    "rmdir",
    "kill ",
    "kill -",
    "killall",
    "pkill",
    "shutdown",
    "reboot",
    "poweroff",
    "halt",
    "dd ",
    "mkfs",
    "fdisk",
    "parted",
    "wipefs",
    "systemctl stop",
    "systemctl disable",
    "chmod 777",
    "chown",
    "mv /",
    "cp /dev/",
    "> /dev/",
    "curl | bash",
    "curl | sh",
    "wget -O- | bash",
]

# Commands that are outright blocked and never executed.
BLOCKED_COMMANDS = [
    "rm -rf /",
    "rm -rf /*",
    "dd if=/dev/zero of=/dev/sda",
    ":(){ :|:& };:",  # fork bomb
    "mkfs.ext4 /dev/sda",
]

# ─── LLM System Prompt ──────────────────────────────────────────────────────
SYSTEM_PROMPT = """\
You are ASO Voice Commander, a Kurdish-speaking computer control agent.
You receive transcribed Sorani Kurdish text from the user's voice.
Your job: understand the user's intent and respond with the exact Linux bash \
command(s) to execute on their Ubuntu/Linux computer.

RULES:
1. Output ONLY the raw bash command(s). One command per line.
2. Do NOT wrap commands in markdown code blocks or backticks.
3. Do NOT add explanations, comments, or Kurdish text in your output.
4. If the user asks a general question (not a computer action), output: \
REPLY: <your answer in Sorani Kurdish>
5. If the command is ambiguous or dangerous, output: \
CONFIRM: <description of what you plan to do in Sorani Kurdish>
6. Common Kurdish commands you should understand:
   - "فایلەکان نیشانبدە" = ls -la
   - "فایلی سێرڤەرەکە بەدیار بێنە" = show server file
   - "پڕۆسێسەکان نیشانبدە" = ps aux or htop
   - "پڕۆسێسەکان ڕابگرە" = kill processes
   - "ئینتەرنێت هەیە؟" = ping -c 3 google.com
   - "مێموری بەکارهاتوو" = free -h
   - "دیسکی بەکارهاتوو" = df -h
   - "فایلێک دروستبکە" = touch or mkdir
   - "فایلێک بسڕەوە" = rm (with confirm)
   - "چی ڕاندەکات؟" = ps aux / systemctl status
   - "ئەم فولدەرە بکەرەوە" = cd / ls of directory
   - "فایلەکە بخوێنەوە" = cat / less / head
   - "سیستەم چۆنە؟" = uname -a && uptime && free -h
7. You understand Sorani Kurdish (ckb) natively. The user speaks only Kurdish.
"""
