const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

const fontPath = path.join(__dirname, 'canvas', 'fonts', 'Rounded.otf');
registerFont(fontPath, { family: 'CoreSansAR' });

async function createWelcomeCanvas(backgroundImgPath, img1, img2, userName, userNumber, threadName, potato) {
    const width = 1200;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Draw background
    try {
        const bgImg = await loadImage(backgroundImgPath);
        ctx.drawImage(bgImg, 0, 0, width, height);
    } catch (err) {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);
    }

    // Draw circular profile image
    async function drawCircularImage(imageSrc, x, y, radius, borderColor, borderWidth = 5) {
        try {
            const image = await loadImage(imageSrc);
            ctx.beginPath();
            ctx.arc(x, y, radius + borderWidth, 0, Math.PI * 2);
            ctx.fillStyle = borderColor;
            ctx.fill();
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(image, x - radius, y - radius, radius * 2, radius * 2);
            ctx.restore();
        } catch (err) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#1f1f1f';
            ctx.fill();
        }
    }

    await drawCircularImage(img2, width - 120, 100, 55, '#f97316');
    ctx.font = 'bold 20px CoreSansAR, sans-serif';
    ctx.fillStyle = '#f97316';
    ctx.textAlign = 'right';
    ctx.fillText('Added by ' + potato, width - 190, 105);

    await drawCircularImage(img1, 120, height - 100, 55, '#ea580c');
    ctx.font = 'bold 24px CoreSansAR, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(userName, 190, height - 95);

    ctx.font = 'bold 42px CoreSansAR, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(threadName, width / 2, 335);

    ctx.font = 'bold 56px CoreSansAR, sans-serif';
    const nameGradient = ctx.createLinearGradient(width / 2 - 200, 0, width / 2 + 200, 0);
    nameGradient.addColorStop(0, '#f97316');
    nameGradient.addColorStop(1, '#ea580c');
    ctx.fillStyle = nameGradient;
    ctx.fillText('WELCOME', width / 2, 410);

    ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 180, 430);
    ctx.lineTo(width / 2 + 180, 430);
    ctx.stroke();

    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#a0a0a0';
    ctx.textAlign = 'center';
    ctx.fillText(`You are the ${userNumber}th member`, width / 2, 480);

    return canvas.createPNGStream();
}

module.exports = {
    config: {
        name: "welcome",
        version: "1.3",
        author: "Allou Mohamed",
        category: "events"
    },

    onStart: async ({ threadsData, event, message, usersData }) => {
        const type = "log:subscribe";
        if (event.logMessageType != type) return;

        try {
            await threadsData.refreshInfo(event.threadID);
            const threadsInfo = await threadsData.get(event.threadID);

            const threadName = threadsInfo.threadName;
            const joined = event.logMessageData.addedParticipants[0].userFbId;
            const by = event.author;
            const img1 = await usersData.getAvatarUrl(joined);
            const img2 = await usersData.getAvatarUrl(by);
            const userNumber = threadsInfo.members?.length || 1;
            const userName = event.logMessageData.addedParticipants[0].fullName;
            const authorN = await usersData.getName(by);

            // Background folder থেকে random image
            const bgFolder = path.join(__dirname, 'canvas', 'backgrounds');
            if (!fs.existsSync(bgFolder)) fs.mkdirSync(bgFolder, { recursive: true });

            const bgFiles = fs.readdirSync(bgFolder).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
            const randomBg = bgFiles.length > 0 ? path.join(bgFolder, bgFiles[Math.floor(Math.random() * bgFiles.length)]) : null;

            const welcomeImage = await createWelcomeCanvas(randomBg, img1, img2, userName, userNumber, threadName, authorN);

            // tmp folder create
            const tmpFolder = path.join(__dirname, 'tmp');
            if (!fs.existsSync(tmpFolder)) fs.mkdirSync(tmpFolder, { recursive: true });

            const imagePath = path.join(tmpFolder, global.utils.randomString(4) + ".png");
            const writeStream = fs.createWriteStream(imagePath);
            welcomeImage.pipe(writeStream);

            await new Promise(resolve => writeStream.on('finish', resolve));
            await message.send({ attachment: fs.createReadStream(imagePath) });
            fs.unlinkSync(imagePath);

        } catch (error) {
            console.error("❌ [WELCOME] Error:", error.message);
            console.error(error.stack);
        }
    }
};
