class TimerApp {
  constructor() {
    this.totalTime = 0;
    this.remainingTime = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.interval = null;
    this.soundEnabled = true;
    this.repeatEnabled = false;
    this.volume = 0.5;

    this.initElements();
    this.bindEvents();
    this.updateDisplay();
    this.createAudioContext();
  }

  initElements() {
    this.timeDisplay = document.getElementById("timeDisplay");
    this.statusText = document.getElementById("statusText");
    this.progressRing = document.getElementById("progressRing");
    this.progressPercent = document.getElementById("progressPercent");
    this.minutesInput = document.getElementById("minutesInput");
    this.secondsInput = document.getElementById("secondsInput");
    this.startBtn = document.getElementById("startBtn");
    this.pauseBtn = document.getElementById("pauseBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.timeInputSection = document.getElementById("timeInputSection");
    this.notificationModal = document.getElementById("notificationModal");
    this.closeNotification = document.getElementById("closeNotification");
    this.soundToggle = document.getElementById("soundToggle");
    this.repeatToggle = document.getElementById("repeatToggle");
    this.volumeSlider = document.getElementById("volumeSlider");
  }

  bindEvents() {
    this.startBtn.addEventListener("click", () => this.startTimer());
    this.pauseBtn.addEventListener("click", () => this.pauseTimer());
    this.resetBtn.addEventListener("click", () => this.resetTimer());
    this.closeNotification.addEventListener("click", () => this.closeModal());

    document.querySelectorAll(".preset-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const minutes = parseInt(e.target.dataset.minutes);
        this.setPresetTime(minutes);
      });
    });

    this.soundToggle.addEventListener("click", () => this.toggleSound());
    this.repeatToggle.addEventListener("click", () => this.toggleRepeat());
    this.volumeSlider.addEventListener("input", (e) => {
      this.volume = e.target.value / 100;
    });

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (this.isRunning) {
          this.pauseTimer();
        } else {
          this.startTimer();
        }
      } else if (e.code === "Escape") {
        this.resetTimer();
      }
    });
  }

  createAudioContext() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
  }

  playNotificationSound() {
    if (!this.soundEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(
      600,
      this.audioContext.currentTime + 0.1
    );
    oscillator.frequency.setValueAtTime(
      800,
      this.audioContext.currentTime + 0.2
    );

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      this.volume,
      this.audioContext.currentTime + 0.05
    );
    gainNode.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + 0.3
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  setPresetTime(minutes) {
    if (this.isRunning) return;

    this.minutesInput.value = minutes;
    this.secondsInput.value = 0;

    document.querySelectorAll(".preset-btn").forEach((btn) => {
      btn.classList.remove("bg-blue-600");
      btn.classList.add("bg-gray-700");
    });
    event.target.classList.remove("bg-gray-700");
    event.target.classList.add("bg-blue-600");

    setTimeout(() => {
      event.target.classList.remove("bg-blue-600");
      event.target.classList.add("bg-gray-700");
    }, 1000);
  }

  startTimer() {
    if (this.isPaused) {
      this.resumeTimer();
      return;
    }

    const minutes = parseInt(this.minutesInput.value) || 0;
    const seconds = parseInt(this.secondsInput.value) || 0;

    if (minutes === 0 && seconds === 0) {
      this.showNotification("Masukkan waktu yang valid!");
      return;
    }

    this.totalTime = minutes * 60 + seconds;
    this.remainingTime = this.totalTime;
    this.isRunning = true;
    this.isPaused = false;

    this.updateButtons();
    this.timeInputSection.style.display = "none";

    this.interval = setInterval(() => {
      this.remainingTime--;
      this.updateDisplay();

      if (this.remainingTime <= 0) {
        this.completeTimer();
      }
    }, 1000);

    this.statusText.textContent = "Berjalan...";
    this.timeDisplay.classList.add("active-glow");
  }

  pauseTimer() {
    if (!this.isRunning) return;

    this.isPaused = true;
    this.isRunning = false;
    clearInterval(this.interval);

    this.statusText.textContent = "Dijeda";
    this.timeDisplay.classList.remove("active-glow");
    this.updateButtons();
  }

  resumeTimer() {
    this.isPaused = false;
    this.isRunning = true;

    this.interval = setInterval(() => {
      this.remainingTime--;
      this.updateDisplay();

      if (this.remainingTime <= 0) {
        this.completeTimer();
      }
    }, 1000);

    this.statusText.textContent = "Berjalan...";
    this.timeDisplay.classList.add("active-glow");
    this.updateButtons();
  }

  resetTimer() {
    this.isRunning = false;
    this.isPaused = false;
    clearInterval(this.interval);

    this.remainingTime = 0;
    this.totalTime = 0;

    this.updateDisplay();
    this.updateButtons();

    this.timeInputSection.style.display = "block";
    this.statusText.textContent = "Siap Dimulai";
    this.timeDisplay.classList.remove("active-glow");
  }

  completeTimer() {
    this.isRunning = false;
    clearInterval(this.interval);

    this.statusText.textContent = "Selesai!";
    this.timeDisplay.classList.remove("active-glow");

    this.playNotificationSound();
    this.showModal();

    if (this.repeatEnabled) {
      setTimeout(() => {
        this.resetTimer();
        setTimeout(() => this.startTimer(), 1000);
      }, 3000);
    } else {
      this.updateButtons();
      this.timeInputSection.style.display = "block";
    }
  }

  updateDisplay() {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;

    this.timeDisplay.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (this.totalTime > 0) {
      const progress =
        ((this.totalTime - this.remainingTime) / this.totalTime) * 100;
      const circumference = 2 * Math.PI * 54;
      const offset = circumference - (progress / 100) * circumference;

      this.progressRing.style.strokeDashoffset = offset;
      this.progressPercent.textContent = `${Math.round(progress)}%`;
    } else {
      this.progressRing.style.strokeDashoffset = 339.292;
      this.progressPercent.textContent = "0%";
    }
  }

  updateButtons() {
    if (this.isRunning) {
      this.startBtn.disabled = true;
      this.startBtn.classList.add("opacity-50", "cursor-not-allowed");
      this.pauseBtn.disabled = false;
      this.pauseBtn.classList.remove("opacity-50", "cursor-not-allowed");
    } else if (this.isPaused) {
      this.startBtn.disabled = false;
      this.startBtn.classList.remove("opacity-50", "cursor-not-allowed");
      this.startBtn.innerHTML = "▶️ Lanjut";
      this.pauseBtn.disabled = true;
      this.pauseBtn.classList.add("opacity-50", "cursor-not-allowed");
    } else {
      this.startBtn.disabled = false;
      this.startBtn.classList.remove("opacity-50", "cursor-not-allowed");
      this.startBtn.innerHTML = "▶️ Mulai";
      this.pauseBtn.disabled = true;
      this.pauseBtn.classList.add("opacity-50", "cursor-not-allowed");
    }
  }

  showModal() {
    this.notificationModal.classList.remove("opacity-0", "pointer-events-none");
    this.notificationModal.querySelector("div").classList.remove("scale-95");
    this.notificationModal.querySelector("div").classList.add("scale-100");
  }

  closeModal() {
    this.notificationModal.classList.add("opacity-0", "pointer-events-none");
    this.notificationModal.querySelector("div").classList.remove("scale-100");
    this.notificationModal.querySelector("div").classList.add("scale-95");
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    const toggle = this.soundToggle;
    const slider = toggle.querySelector("div");

    if (this.soundEnabled) {
      toggle.classList.remove("bg-gray-600");
      toggle.classList.add("bg-blue-500");
      slider.classList.remove("left-0.5");
      slider.classList.add("right-0.5");
    } else {
      toggle.classList.remove("bg-blue-500");
      toggle.classList.add("bg-gray-600");
      slider.classList.remove("right-0.5");
      slider.classList.add("left-0.5");
    }
  }

  toggleRepeat() {
    this.repeatEnabled = !this.repeatEnabled;
    const toggle = this.repeatToggle;
    const slider = toggle.querySelector("div");

    if (this.repeatEnabled) {
      toggle.classList.remove("bg-gray-600");
      toggle.classList.add("bg-blue-500");
      slider.classList.remove("left-0.5");
      slider.classList.add("right-0.5");
    } else {
      toggle.classList.remove("bg-blue-500");
      toggle.classList.add("bg-gray-600");
      slider.classList.remove("right-0.5");
      slider.classList.add("left-0.5");
    }
  }

  showNotification(message) {
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg z-50 transform translate-x-full transition-transform duration-300";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 100);

    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TimerApp();
});
