require('./server'); // chạy web server để giữ online
const mineflayer = require("mineflayer");

const bot = mineflayer.createBot({
  host: "116.98.230.227",
  port: 2007,
  username: "noledadenafkfarm2",
  auth: "offline",
  version: "1.20.1",
});

bot.on("spawn", () => {
  console.log("✅ Bot đã vào server thành công!");

  let isSleeping = false;

  function sneakCycle() {
    if (!bot.entity || isSleeping) return;

    bot.setControlState('sneak', true);
    console.log("🔄 Bot bắt đầu sneak trong 30 giây...");

    setTimeout(() => {
      bot.setControlState('sneak', false);
      console.log("✋ Bot dừng sneak, nghỉ 2 giây.");

      setTimeout(() => {
        sneakCycle();
      }, 2000);

    }, 30000);
  }

  sneakCycle();

  // Tự động đi ngủ ban đêm
  setInterval(() => {
    const time = bot.time.timeOfDay;
    const isNight = time >= 13000 && time <= 23000;

    if (isNight && !isSleeping) {
      const bed = bot.findBlock({
        matching: block => bot.isABed(block),
        maxDistance: 6
      });

      if (bed) {
        bot.sleep(bed).then(() => {
          isSleeping = true;
          console.log("💤 Bot đang ngủ...");
        }).catch(err => {
          console.log("⚠️ Không thể ngủ:", err.message);
        });
      } else {
        console.log("🛏️ Không tìm thấy giường gần đó để ngủ.");
      }
    }
  }, 10000); // kiểm tra mỗi 10 giây

  // Khi trời sáng thì tự dậy
  bot.on("wake", () => {
    isSleeping = false;
    console.log("🌞 Bot đã thức dậy.");
    sneakCycle(); // quay lại chu trình sneak
  });

  bot.on('end', () => {
    bot.setControlState('sneak', false);
  });
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
