"""
CyberSafe AI - Local Backend & Web Server
Serves the GPU-Accelerated CyberSafe Threat Intelligence Dashboard
"""

import http.server
import socketserver
import os
import sys

# Ensure UTF-8 encoding for Windows stdout
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Clean custom logging for cyber telemetry requests
        print(f"[CYBERSAFE TELEMETRY LOG] {self.address_string()} - {args[0]}")

def run_server():
    os.chdir(DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    port = PORT
    for try_port in range(PORT, PORT + 20):
        try:
            with socketserver.TCPServer(("", try_port), Handler) as httpd:
                print("="*65)
                print("[CYBERSAFE AI] - GPU-ACCELERATED CYBER THREAT ENGINE")
                print("[CYBERSAFE AI] - NVIDIA TensorRT / CUDA Simulator Running")
                print(f"[CYBERSAFE AI] - Dashboard URL: http://localhost:{try_port}")
                print("="*65)
                httpd.serve_forever()
                break
        except OSError:
            continue

if __name__ == "__main__":
    run_server()
