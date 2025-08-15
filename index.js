require('./server'); // chạy web server để giữ online
const mineflayer = require("mineflayer");

const bot = mineflayer.createBot({
  host: "116.98.230.227",
  port: 2007,
  username: "noledadenafkfarm",
  auth: "offline",
  version: "1.20.1", // Nếu server 1.21.8 thì nên đổi thành version mới nhất mà mineflayer hỗ trợ
});

bot.on("spawn", () => {
  console.log("✅ Bot đã vào server thành công!");
});

bot.on("end", (reason) => {
  console.log("⚠️ Bot bị ngắt kết nối. Lý do:", reason);
  console.log("🔄 Đang thử kết nối lại sau 10 giây...");
  setTimeout(() => {
    process.exit(1); // Thoát để Render/Replit restart lại bot
  }, 10000);
});

bot.on("error", (err) => {
  console.log("❌ Lỗi:", err.message);
});

bot.on("kicked", (reason) => {
  console.log("👢 Bot bị kick:", reason);
});
