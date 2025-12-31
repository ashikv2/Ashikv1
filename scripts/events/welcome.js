const { getTime } = global.utils;
const { createCanvas, loadImage, registerFont } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

// 🔹 Preload font once
(async () => {
  try {
    const fontPath = path.join(__dirname, "cache", "tt-modernoir-trial.bold.ttf");
    if (!fs.existsSync(fontPath)) {
      const fontUrl = "https://github.com/MR-MAHABUB-004/MAHABUB-BOT-STORAGE/raw/main/fronts/tt-modernoir-trial.bold.ttf";
      const { data } = await axios.get(fontUrl, { responseType: "arraybuffer" });
      await fs.outputFile(fontPath, data);
    }
    registerFont(fontPath, { family: "ModernoirBold" });
  } catch (err) {
    console.error("Font load error:", err);
  }
})();

module.exports = {
  config: {
    name: "welcome",
    version: "4.2",
    author: "ASHIK × HERO",
    category: "events"
  },

  onStart: async ({ threadsData, message, event, api }) => {
    try {
      const { threadID, logMessageType, logMessageData } = event;
      if (logMessageType !== "log:subscribe") return;

      const botID = api.getCurrentUserID();
      const added = logMessageData.addedParticipants || [];

      // 🟢 Bot added
      if (added.some(u => u.userFbId === botID)) {
        await api.changeNickname("🤖 Welcome Bot", threadID, botID);
        return api.sendMessage("🤖 Bot connected successfully!", threadID);
      }

      // 🟢 User added
      const user = added[0];
      const userName = user.fullName;
      const userID = user.userFbId;

      const threadData = await threadsData.get(threadID);
      const threadName = threadData.threadName || "Group Chat";
      const memberCount = (await api.getThreadInfo(threadID)).participantIDs.length;

      // 🕒 Live date & time (BD)
      const time = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });

      // 🎨 Canvas
      const canvas = createCanvas(1000, 500);
      const ctx = canvas.getContext("2d");

      const bg = await loadImage("https://files.catbox.moe/zhso03.jpg");
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      // 👤 Avatar
      const avatarUrl = `https://graph.facebook.com/${userID}/picture?height=720&width=720`;
      const avatar = await loadImage((await axios.get(avatarUrl, { responseType: "arraybuffer" })).data);

      ctx.save();
      ctx.beginPath();
      ctx.arc(500, 130, 90, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatar, 410, 40, 180, 180);
      ctx.restore();

      // ✨ Text
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = 6;

      ctx.font = "bold 40px ModernoirBold";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(userName, 500, 270);

      ctx.font = "bold 28px ModernoirBold";
      ctx.fillStyle = "#ffea00";
      ctx.fillText(`WELCOME TO ${threadName}`, 500, 315);

      ctx.font = "bold 24px ModernoirBold";
      ctx.fillStyle = "#00ffcc";
      ctx.fillText(`You're the ${memberCount}th member`, 500, 355);

      // 💾 Save
      const imgPath = path.join(__dirname, "cache", `welcome_${userID}.png`);
      await fs.ensureDir(path.dirname(imgPath));
      await fs.writeFile(imgPath, canvas.toBuffer());

      // 📨 Stylish message with CODE BORDER
      const welcomeMsg = `
╔════════〔 🔐 SYSTEM VERIFIED 🔐 〕════════╗
║ 01D 46D 493 48A 486 48F 485 494 489 48A ║
║ 01D 46D 490 493 486 497 486 493        ║
╚════════════════════════════════════════╝

✦ 𝐇𝐞𝐥𝐥𝐨 ${userName} ✦
𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐭𝐨 ✦ ${threadName} ✦

✨ You're the 「 ${memberCount} 」 member of this group ✨
🎉 Stay active & enjoy!

━━━━━━━━━━━━━━━━━━━━━━
📅 ${time}
🌍 GMT +06:00 (Bangladesh)
━━━━━━━━━━━━━━━━━━━━━━
`;

      await message.send({
        body: welcomeMsg,
        attachment: fs.createReadStream(imgPath)
      });

      fs.unlinkSync(imgPath);

    } catch (err) {
      console.error("Welcome error:", err);
    }
  }
};
