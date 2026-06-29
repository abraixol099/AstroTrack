console.log("WEEK 1 SCRIPT ACTIVE");
let activeSection = "theory"; // or "python"
document.addEventListener("DOMContentLoaded", () => {
    const letters = document.querySelectorAll("#week-title span");
    let index = 0;
    let phase = "typing"; // typing → hold → deleting

    function animate() {
        if (phase === "typing") {
        if (index < letters.length) {
            letters[index].classList.add("show");
            index++;
            setTimeout(animate, 180);
        } else {
            // FULL WORD SHOWN — HOLD 5 SECONDS
            phase = "hold";
            setTimeout(animate, 5000);
        }
        }

        else if (phase === "hold") {
        phase = "deleting";
        setTimeout(animate, 180);
        }

        else if (phase === "deleting") {
        if (index > 0) {
            index--;
            letters[index].classList.remove("show");
            setTimeout(animate, 160);
        } else {
            // RESET AND LOOP
            phase = "typing";
            setTimeout(animate, 600);
        }
        }
    }

    animate();


    // ✅ Mission timeline logic
    document.querySelectorAll(".day-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const day = btn.dataset.day;

        document.querySelectorAll(".day-btn")
        .forEach(b => b.classList.remove("active"));

        document.querySelectorAll(".day-panel")
        .forEach(p => p.classList.remove("active"));

        btn.classList.add("active");

        const panel = document.querySelector(`.day-panel[data-day="${day}"]`);
        if (panel) panel.classList.add("active");
    });
    });

});





function setupSection(selector, storageKey, sectionName) {
  const REQUIRED_TIME = 120;
  const progressData = JSON.parse(localStorage.getItem(storageKey)) || {};

  document.querySelectorAll(selector).forEach(el => {
    const day = Number(el.dataset.day);
    const checkbox = el.querySelector("input");
    const timeLabel = el.querySelector(".time-indicator");
    const saved = progressData[day];

    if (saved) {
      checkbox.checked = saved.completed;
      timeLabel.textContent = `⏱ ${saved.time} / ${REQUIRED_TIME} min`;
    }

    if (day > 1 && !progressData[day - 1]?.completed) {
      el.classList.add("locked");
    }

    el.onclick = () => {
      if (el.classList.contains("locked")) return;

      activeDay = day;
      activeSection = sectionName;

      noteTitle.textContent = `Day ${day} — ${sectionName.toUpperCase()}`;
      dayNote.value = saved?.note || "";
      dayTime.value = saved?.time || "";

      noteModal.style.display = "flex";
    };
  });

  markComplete.onclick = () => {
    const time = Number(dayTime.value);
    if (time < REQUIRED_TIME) {
      alert("⛔ 120 minutes required.");
      return;
    }

    progressData[activeDay] = {
      completed: true,
      time,
      note: dayNote.value.trim()
    };

    localStorage.setItem(storageKey, JSON.stringify(progressData));
    noteModal.style.display = "none";
    location.reload();
  };

  markIncomplete.onclick = () => {
    delete progressData[activeDay];
    localStorage.setItem(storageKey, JSON.stringify(progressData));
    noteModal.style.display = "none";
    location.reload();
  };
}


const canvas = document.getElementById("starfield");

if (canvas) {
  const ctx = canvas.getContext("2d");
  let stars = [];
  const STAR_COUNT = 300;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.4,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
  }

  createStars();

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let star of stars) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
      ctx.fill();

      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    }

    requestAnimationFrame(animateStars);
  }

  animateStars();
}


document.addEventListener("DOMContentLoaded", () => {

  // ✅ Persist all checkboxes
  document.querySelectorAll("input[type='checkbox']").forEach(cb => {
    const saved = localStorage.getItem(cb.id);
    cb.checked = saved === "true";

    cb.addEventListener("change", () => {
      localStorage.setItem(cb.id, cb.checked);
    });
  });

  // ✅ Project checkbox → show GitHub link
  const projectCheckbox = document.getElementById("w1-project");
  const projectLink = document.getElementById("projectLink");

  if (projectCheckbox && projectLink) {
    projectLink.style.display = projectCheckbox.checked ? "block" : "none";

    projectCheckbox.addEventListener("change", () => {
      projectLink.style.display = projectCheckbox.checked ? "block" : "none";
    });
  }

});

const REQUIRED_TIME = 120;
let activeDay = null;

const progressData = JSON.parse(localStorage.getItem("week1Progress")) || {};

document.querySelectorAll(".day-check").forEach(el => {
  const day = el.dataset.day;
  const checkbox = el.querySelector("input");
  const timeLabel = el.querySelector(".time-indicator");

  const saved = progressData[day];

  if (saved) {
    checkbox.checked = saved.completed;
    timeLabel.textContent = `⏱ ${saved.time} / ${REQUIRED_TIME} min`;
  }

  // LOCK LOGIC
  if (day > 1 && !progressData[day - 1]?.completed) {
    el.classList.add("locked");
  }

  el.addEventListener("click", () => {
    if (el.classList.contains("locked")) return;

    activeDay = day;
    document.getElementById("noteTitle").textContent = `Day ${day}`;
    document.getElementById("dayNote").value = saved?.note || "";
    document.getElementById("dayTime").value = saved?.time || "";

    document.getElementById("noteModal").style.display = "flex";
  });
});

const modal = document.getElementById("noteModal");
const markCompleteBtn = document.getElementById("markComplete");
const markIncompleteBtn = document.getElementById("markIncomplete");

markCompleteBtn.onclick = () => {
  const note = dayNote.value.trim();
  const time = Number(dayTime.value);

  if (time < REQUIRED_TIME) {
    alert("⛔ 120 minutes required to unlock the next day.");
    return;
  }

  progressData[activeDay] = {
    completed: true,
    time,
    note
  };

  localStorage.setItem("week1Progress", JSON.stringify(progressData));
  modal.style.display = "none";
  location.reload();
};

markIncompleteBtn.onclick = () => {
  if (!activeDay) return;

  delete progressData[activeDay];

  localStorage.setItem("week1Progress", JSON.stringify(progressData));
  modal.style.display = "none";
  location.reload();
};

// CLOSE MODAL
document.getElementById("noteModal").onclick = e => {
  if (e.target.id === "noteModal") {
    e.target.style.display = "none";
  }
};    