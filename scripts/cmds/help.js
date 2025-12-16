const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "help",
        aliases: ["menu", "commands"],
        version: "4.8",
        author: "ASHIK",
        shortDescription: "Show all available commands",
        longDescription: "Displays a clean and premium-styled categorized list of commands.",
        category: "system",
        guide: "{pn}help [command name]"
    },

    onStart: async function({ message, args, prefix }) {
        const allCommands = global.GoatBot.commands;

        // যদি ইউজার কোনো স্পেসিফিক কমান্ড চায়
        if (args[0]) {
            const query = args[0].toLowerCase();
            const cmd = allCommands.get(query) || [...allCommands.values()].find(c => (c.config.aliases || []).includes(query));
            if (!cmd) return message.reply(`❌ Command "${query}" not found.`);

            const { name, version, author, guide, category, shortDescription, longDescription, aliases, role } = cmd.config;
            const desc = longDescription || shortDescription || "No description";
            const usage = guide?.replace(/{pn}/g, prefix) || `${prefix}${name}`;
            const requiredRole = role ?? 0;

            return message.reply(
                `☠️ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 ☠️\n\n` +
                `➥ Name: ${name}\n` +
                `➥ Category: ${category || "Uncategorized"}\n` +
                `➥ Description: ${desc}\n` +
                `➥ Aliases: ${aliases?.length ? aliases.join(", ") : "None"}\n` +
                `➥ Usage: ${usage}\n` +
                `➥ Permission: ${requiredRole}\n` +
                `➥ Author: ${author}\n` +
                `➥ Version: ${version}`
            );
        }

        // Pre-defined stylish categories design
        let msg = `╔══════════════════════════════════════════╗\n` +
                  `║        🤖 ASHIK 🤖        ║\n` +
                  `╚══════════════════════════════════════════╝\n\n`;

        const categoryList = [
            { name: "👑 𝗔𝗗𝗠𝗜𝗡 📄", cmds: ["delete"] },
            { name: "🧠 𝗔𝗜 🗂️", cmds: ["pi", "prompt"] },
            { name: "⚡ 𝗔𝗜-𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗 📄", cmds: ["nijix"] },
            { name: "🖼️ 𝗔𝗜-𝗜𝗠𝗔𝗚𝗘 🗂️", cmds: ["art","edit","fluxkontext","fluxpro","gpt","imagen3","midjourney","nanobanana","supanime"] },
            { name: "💬 𝗕𝗢𝗫 𝗖𝗛𝗔𝗧 📄", cmds: ["adduser","admin","all","antichangeinfobox","autosetname","badwords","ban","busy","count","filteruser","kick","onlyadminbox","refresh","rules","sendnoti","setname","spamban","unsend","warn"] },
            { name: "⚙️ 𝗖𝗢𝗡𝗙𝗜𝗚 🗂️", cmds: ["prefix","setalias"] },
            { name: "📞 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗔𝗗𝗠𝗜𝗡 📄", cmds: ["callad"] },
            { name: "🛠️ 𝗖𝗨𝗦𝗧𝗢𝗠 🗂️", cmds: ["setleave","setwelcome","shortcut"] },
            { name: "🎮 𝗚𝗔𝗠𝗘 📄", cmds: ["daily","dhbc","guessnumber","maze","slots"] },
            { name: "🏆 𝗥𝗔𝗡𝗞 & 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 🗂️", cmds: ["customrankcard","rank","rankup","vip"] },
            { name: "🖥️ 𝗦𝗬𝗦𝗧𝗘𝗠 & 𝗧𝗢𝗢𝗟𝗦 📄", cmds: ["file","fork","help","uptime","screenshot"] },
        ];

        for (const cat of categoryList) {
            msg += `⧉───────[ ${cat.name} ]───────⧉\n`;
            msg += `│ ❖ ${cat.cmds.join(" × ")}\n`;
            msg += `⧉────────────────────────────⧉\n\n`;
        }

        msg += `╔══════════════════════════════════════════╗\n` +
               `║ ➥ ${prefix}help [command name] → Info           ║\n` +
               `║ ➥ ${prefix}callad → Talk with Admins            ║\n` +
               `║ 📄 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗔𝗜 𝗖𝗢𝗡𝗧𝗥𝗢𝗟 𝗣𝗔𝗡𝗘𝗟 📄       ║\n` +
               `╚══════════════════════════════════════════╝\n\n`;

        msg += `👑 𝗢𝗪𝗡𝗘𝗥: ✦ 𝗔𝗦𝗛𝗜𝗞 ✦\n`;
        msg += `🌐 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: https://www.facebook.com/profile.php?id=61578644536780\n`;
        msg += `📝 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${allCommands.size}\n`;

        // ছবি path
        const imagePath = path.join(__dirname, "helppic", "banner.png");

        if (fs.existsSync(imagePath)) {
            return message.reply({ body: msg, attachment: fs.createReadStream(imagePath) });
        } else {
            return message.reply(msg);
        }
    }
};