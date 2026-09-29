const demoFrame = document.querySelector("#demo-frame");
const frameShell = document.querySelector(".frame-shell");

// iframe 固定 1920×1080（styles.css），此处按壳宽等比缩放显示——评审站嵌入画面与
// Unity 1920×1080 实机截图保持比例同构（理由见 styles.css .frame-shell iframe 注释）。
const DEMO_WIDTH = 1920;

function fitDemoFrame() {
  if (!frameShell || !demoFrame) return;
  demoFrame.style.transform = `scale(${frameShell.clientWidth / DEMO_WIDTH})`;
}

window.addEventListener("resize", fitDemoFrame);
fitDemoFrame();

const demoTitle = document.querySelector("#demo-title");
const demoDescription = document.querySelector("#demo-description");
const openDemo = document.querySelector("#open-demo");
const sourceName = document.querySelector("#source-name");
const sourceCode = document.querySelector("#source-code");
const copySource = document.querySelector("#copy-source");
const demoTabs = [...document.querySelectorAll(".demo-tab")];

let currentSource = "";

async function loadSource(name) {
  const file = `${name}.html`;
  const path = `yio-demo/ui/xingque/${file}`;
  sourceName.textContent = file;
  sourceCode.textContent = "正在读取 Yio 源文件…";

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const lines = text.split("\n");
    currentSource = lines.slice(0, 52).join("\n");
    sourceCode.textContent = currentSource;
  } catch (error) {
    currentSource = "";
    sourceCode.textContent = "源码读取需要通过 HTTP 服务访问。请按 README 启动本地静态服务器。";
  }
}

function selectDemo(button) {
  const name = button.dataset.demo;
  const file = `${name}.html`;
  const path = `yio-demo/ui/xingque/${file}`;

  demoTabs.forEach((tab) => tab.classList.toggle("is-active", tab === button));
  demoFrame.src = path;
  demoFrame.title = `星阙行纪${button.dataset.title}`;
  demoTitle.textContent = button.dataset.title;
  demoDescription.textContent = button.dataset.description;
  if (openDemo) openDemo.href = path;
  loadSource(name);
}

demoTabs.forEach((button) => {
  button.addEventListener("click", () => selectDemo(button));
});

copySource.addEventListener("click", async () => {
  if (!currentSource) return;
  await navigator.clipboard.writeText(currentSource);
  const original = copySource.textContent;
  copySource.textContent = "已复制";
  window.setTimeout(() => {
    copySource.textContent = original;
  }, 1400);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

// Unity 实机截图：点击卡片放大预览，点击遮罩任意处 / Esc 关闭。
const lightbox = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightbox-img");

document.querySelectorAll(".shot-card img").forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.hidden = false;
  });
});

lightbox.addEventListener("click", () => {
  lightbox.hidden = true;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) lightbox.hidden = true;
});

loadSource("main");
