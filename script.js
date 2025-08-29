/* ===== UTIL ===== */
const $ = (sel) => document.querySelector(sel);
const todayISO = () => new Date().toISOString().slice(0,10);
const STORE_KEY = "nktt_attendance_v1";

/* ===== YEAR IN FOOTER ===== */
$("#year").textContent = new Date().getFullYear();

/* ===== TEAMS DATA ===== */
const teams = {
  frontend: {
    head: "Sunny",
    members: [
      "Tanvi Kumbhar", "Gopal Shinde", "Radhika Narayankar", "Ruchi Jain",
      "Zikra Shaikh","Shubham Buranpure","Raj Kshatriya","HInal Diwamni"
    ]
  },

  backend: {
    head: "Shashikant Mane",
    members: [
      "Siraj Khan","Nikhil Singh","Ketan Kolapkar","Ritesh Bhosale",
      "Ujawal Guru","Aditya Patil","Bhoomi Jadhav","Dhanashree Gawade",
      "Khushi Singh","Narayani Gupta","Aryan Prajapati"
    ]
  },

  application: {
    head: "Shashikant Mane",
    members: ["Siraj Khan","Nikhil Singh","Ketan Kolapkar","Ritesh Bhosale","Ujawal Guru","Aditya Patil"]
  },

  database: {
    head: "Shashikant Mane",
    members: ["Bhoomi Jadhav","Dhanashree Gawade","Khushi Singh","Narayani Gupta","Aryan Prajapati"]
  },

  aiml: {   // ✅ use a clean key internally
    head: "Yash Mane",
    members: ["Akshada Badgujar","Aatif Ali","Dhanshree Pawar","Drushti Shelke","Sakshi Yadav"]
  }
};

/* ===== SHOW TEAM ===== */
function showTeam(teamKey){
  const box = document.getElementById("team-members");
  if(!teams[teamKey]){ 
    box.innerHTML = "<p class='muted'>Team not found.</p>"; 
    return; 
  }

  const titleMap = {
    frontend: "Frontend",
    backend: "Backend",
    application: "Application",
    database: "Database",
    aiml: "AI/ML"
  };

  const title = titleMap[teamKey] || teamKey;

  // highlight head with a CSS class
  const head = `
    <p class="team-head">
      👑 <strong>${teams[teamKey].head}</strong>
    </p>
  `;

  const members = teams[teamKey].members.map(m => `<li>${m}</li>`).join("");

  box.innerHTML = `
    <div class="card">
      <h3>${title} Team</h3>
      ${head}
      <ul class="team-list">${members}</ul>
    </div>`;
  
  location.hash = "#teams";
}




/* ===== ATTENDANCE (Lifetime via localStorage) ===== */
function loadAttendance(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch{ return []; }
}
function saveAttendance(list){
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
}
function markAttendance(){
  const input = $("#studentName");
  const name = (input.value || "").trim();
  const msg = $("#attendance-msg");
  msg.className = "status";

  if(!name){ msg.textContent = "Please enter your name."; msg.classList.add("err"); return; }

  const date = todayISO();
  const list = loadAttendance();

  // Allow only one record per name per day
  const already = list.find(r => r.name.toLowerCase() === name.toLowerCase() && r.date === date);
  if(already){
    msg.textContent = "You have already marked attendance today.";
    msg.classList.add("warn");
    return;
  }

  list.push({ name, date });
  saveAttendance(list);

  msg.textContent = `✅ Attendance marked for ${name} (${date}).`;
  msg.classList.add("ok");
  input.value = "";
}

/* ===== ADMIN LOGIN & DASHBOARD ===== */
function openLogin(){
  const pass = prompt("Enter Admin Password:");
  if(pass === "admin123"){
    alert("Welcome, Admin!");
    $("#dashboard").style.display = "block";
    renderAttendance();
    location.hash = "#dashboard";
  }else if(pass !== null){
    alert("Wrong password.");
  }
}
function renderAttendance(){
  const list = loadAttendance();
  const ul = $("#attendance-list");
  ul.innerHTML = "";

  if(list.length === 0){
    ul.innerHTML = "<li>No attendance records yet.</li>";
  }else{
    // newest first
    list.sort((a,b)=> (a.date < b.date ? 1 : a.date > b.date ? -1 : a.name.localeCompare(b.name)));
    for(const rec of list){
      const li = document.createElement("li");
      li.textContent = `${rec.date} — ${rec.name}`;
      ul.appendChild(li);
    }
  }

  // stats
  $("#stat-total").textContent = `Total records: ${list.length}`;
  const today = list.filter(r => r.date === todayISO()).length;
  $("#stat-today").textContent = `Today: ${today}`;
}
function clearAllAttendance(){
  if(confirm("This will delete ALL attendance records. Continue?")){
    localStorage.removeItem(STORE_KEY);
    renderAttendance();
  }
}

/* expose functions to HTML */
window.showTeam = showTeam;
window.markAttendance = markAttendance;
window.openLogin = openLogin;
window.clearAllAttendance = clearAllAttendance;
