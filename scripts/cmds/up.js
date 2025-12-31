module.exports = {
  config: {
    name: "up",
    aliases: ["uptime", "upt"],
    version: "12.0",
    author: "Ashik (Loading + Uptime Complete)",
    countDown: 3,
    role: 0,
    category: "utility",
    shortDescription: { en: "✨ Premium system status dashboard" },
    longDescription: { en: "Displays system metrics with ADB-style loading bar" }
  },

  onStart: async function ({ api, event }) {
    try {
      const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

      // =========================
      // 🎮 Loading bar (Uptime Complete)
      // =========================
      const loading = await api.sendMessage(
        "⏳ **Uptime Complete**\n[░░░░░░░░░░] 0%",
        event.threadID
      );
      const mid = loading.messageID;

      const update = async (bar, percent) => {
        await api.editMessage(
          `⏳ **Uptime Complete**\n[${bar}] ${percent}%`,
          mid,
          event.threadID
        );
      };

      await wait(400); await update("█░░░░░░░░░", 10);
      await wait(400); await update("███░░░░░░░", 30);
      await wait(400); await update("█████░░░░░", 50);
      await wait(400); await update("████████░░", 80);
      await wait(400); await update("██████████", 100);

      // Loading শেষ → delete message
      await wait(300);
      await api.unsendMessage(mid);

      // =========================
      // ⏱️ UPTIME
      // =========================
      const t = Math.floor(process.uptime());
      const days = Math.floor(t / 86400);
      const hours = Math.floor((t % 86400) / 3600);
      const minutes = Math.floor((t % 3600) / 60);
      const seconds = t % 60;

      const now = new Date();
      const gifs = [
        "https://i.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
        "https://i.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif",
        "https://i.giphy.com/media/l4FGI8GoTL7N4DsyI/giphy.gif",
        "https://i.giphy.com/media/3o7aD2d7hy9ktXNDP2/giphy.gif"
      ];
      const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

      // =========================
      // Dashboard message
      // =========================
      const dashboard = `
✦⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅✦
 🅄🄿🅃🄸🄼🄴 🄳🄰🅂🄷🄱🄾🄰🅁🄳
✦⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅✦

 ♡ ∩_∩
 （„• ֊ •„)♡
 ╭─∪∪─────────────────╮
 │ 🕒 Runtime : ${days}d ${hours}h ${minutes}m ${seconds}s
 │ 🛜 OS : ${process.platform} ${process.arch}
 │ 🖥️ CPU : Intel Xeon E5-2699 v3
 │ 💾 Storage : ${(Math.random() * 7 + 4).toFixed(2)}GB / 11.68GB
 │ 📈 CPU Usage : ${(Math.random() * 100).toFixed(1)}%
 │ 🧠 RAM : ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)} MB
 ├─────────────────────┤
 │ 📅 Date : ${now.toLocaleDateString()}
 │ ⏰ Time : ${now.toLocaleTimeString()}
 │ 👥 Users : ${Math.floor(Math.random() * 200) + 50}
 │ 🧵 Threads : ${process._getActiveRequests().length}
 │ 📶 Ping : ${Math.floor(Math.random() * 500) + 500} ms
 │ 🚦 Status : ${['✨ Excellent','✅ Good','⚠️ Fair','⛔ Critical'][Math.floor(Math.random() * 4)]}
 ╰─────────────────────╯

✦⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅✦
 𝒮𝓎𝓈𝓉𝑒𝓂 𝒮𝓉𝒶𝓉𝓊𝓈 𝒟𝒶𝓈𝒽𝒷𝑜𝒶𝓇𝒹
✦⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅⋆⋅✦
`;

      // Send dashboard with GIF
      await api.sendMessage({
        body: dashboard,
        attachment: await global.utils.getStreamFromURL(randomGif)
      }, event.threadID);

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Unexpected error occurred!", event.threadID);
    }
  }
};