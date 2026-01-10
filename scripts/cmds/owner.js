const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

/* 👤 WORKING PROFILE PICTURE SYSTEM */
async function getProfilePicture(uid) {
  try {
    const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    return await loadImage(url);
  } catch (e) {
    return null;
  }
}

const fontDir = path.join(__dirname, "assets", "font");
const cacheDir = path.join(__dirname, "cache");
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

if (fs.existsSync(path.join(fontDir, "Orbitron-Bold.ttf"))) {
  registerFont(path.join(fontDir, "Orbitron-Bold.ttf"), { family: "Orbitron" });
}

module.exports = {
  config: {
    name: "owner",
    version: "3.2",
    author: "Ashik",
    role: 0,
    shortDescription: "Neon Galaxy Profile Card",
    category: "profile",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {

    const uid = event.senderID; // 🔥 USER UID

    const canvas = createCanvas(900, 1200);
    const ctx = canvas.getContext("2d");

    /* 🖤 BACKGROUND */
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* 🌌 STARS */
    const starColors = ["#ff69b4", "#a855f7", "#ffffff", "#facc15"];
    for (let i = 0; i < 450; i++) {
      ctx.fillStyle = starColors[Math.floor(Math.random() * starColors.length)];
      ctx.shadowBlur = Math.random() * 18 + 6;
      ctx.shadowColor = ctx.fillStyle;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2 + 1,
        Math.random() * 2 + 1
      );
    }
    ctx.shadowBlur = 0;

    /* 🌈 FRAME */
    const frameGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    frameGrad.addColorStop(0, "#ff0000");
    frameGrad.addColorStop(0.25, "#ff00ff");
    frameGrad.addColorStop(0.5, "#00ffff");
    frameGrad.addColorStop(0.75, "#00ff00");
    frameGrad.addColorStop(1, "#ffff00");

    ctx.lineWidth = 10;
    ctx.strokeStyle = frameGrad;
    ctx.shadowBlur = 25;
    ctx.shadowColor = "#ffffff";
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
    ctx.shadowBlur = 0;

    /* 👤 PROFILE IMAGE */
    const avatar = await getProfilePicture(uid);
    const cx = canvas.width / 2;
    const cy = 220;
    const r = 130;

    if (avatar) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatar, cx - r, cy - r, r * 2, r * 2);
      ctx.restore();
    }

    /* 🧑 NAME */
    ctx.textAlign = "center";
    ctx.font = "42px Orbitron";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("USER PROFILE CARD", cx, 420);

    ctx.font = "22px Orbitron";
    ctx.fillStyle = "#00ffff";
    ctx.fillText("NEON GALAXY SYSTEM", cx, 455);

    /* 📦 INFO BOX */
    function infoBox(x, y, title, value, glow) {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = 20;
      ctx.shadowColor = glow;
      ctx.fillRect(x, y, 360, 90);
      ctx.shadowBlur = 0;

      ctx.font = "18px Orbitron";
      ctx.fillStyle = "#aaa";
      ctx.fillText(title, x + 20, y + 32);

      ctx.font = "26px Orbitron";
      ctx.fillStyle = "#fff";
      ctx.fillText(value, x + 20, y + 65);
    }

    infoBox(80, 540, "User ID", uid, "#a855f7");
    infoBox(460, 540, "Bot", "ANNIE'S BB'Z", "#22c55e");

    /* 🌈 FOOTER */
    ctx.fillStyle = frameGrad;
    ctx.fillRect(0, 1040, canvas.width, 90);

    ctx.font = "28px Orbitron";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText("ANNIE'S BB'Z • PROFILE SYSTEM", cx, 1095);

    const filePath = path.join(cacheDir, `profile_${uid}.png`);
    fs.writeFileSync(filePath, canvas.toBuffer());

    api.sendMessage(
      { attachment: fs.createReadStream(filePath) },
      event.threadID,
      () => fs.unlinkSync(filePath)
    );
  }
};
