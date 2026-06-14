export async function copyText(text: string): Promise<boolean> {
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.left = "-9999px";
  input.style.top = "0";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.focus();
  input.select();
  input.setSelectionRange(0, input.value.length);

  try {
    if (document.execCommand("copy")) return true;
  } catch {
    // Fall through to the asynchronous Clipboard API.
  } finally {
    input.remove();
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

export function showManualCopy(text: string) {
  const overlay = document.createElement("div");
  overlay.className = "copy-fallback-overlay";
  overlay.innerHTML = `
    <section class="copy-fallback-dialog" role="dialog" aria-modal="true" aria-label="手动复制分享内容">
      <header><strong>复制分享内容</strong><button type="button" aria-label="关闭">×</button></header>
      <p>当前浏览器限制自动复制，请按 Ctrl+C，手机端可长按复制。</p>
      <textarea readonly></textarea>
    </section>
  `;
  const textarea = overlay.querySelector("textarea");
  const close = () => overlay.remove();
  if (!textarea) return;
  textarea.value = text;
  overlay.querySelector("button")?.addEventListener("click", close);
  overlay.addEventListener("click", (event) => { if (event.target === overlay) close(); });
  document.body.appendChild(overlay);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
}
